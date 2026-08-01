import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

/// Android emulators can't reach the host machine via 127.0.0.1 (that
/// address is the emulator's own loopback), so this needs 10.0.2.2 there.
/// iOS simulator, macOS, and web all share the host's loopback normally.
const String apiBaseUrl = 'http://127.0.0.1:8000';

class ApiException implements Exception {
  final String message;
  ApiException(this.message);

  @override
  String toString() => message;
}

class ApiClient {
  static Future<String?> _token() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
  }

  static Future<Map<String, dynamic>> get(String path) async {
    final token = await _token();
    final response = await http.get(
      Uri.parse('$apiBaseUrl$path'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    return _decode(response);
  }

  static Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body,
  ) async {
    final token = await _token();
    final response = await http.post(
      Uri.parse('$apiBaseUrl$path'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );
    return _decode(response);
  }

  static Future<Map<String, dynamic>> postForm(
    String path,
    Map<String, String> fields,
  ) async {
    final token = await _token();
    final request = http.MultipartRequest('POST', Uri.parse('$apiBaseUrl$path'))
      ..fields.addAll(fields);
    if (token != null) request.headers['Authorization'] = 'Bearer $token';

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);
    return _decode(response);
  }

  static Future<Map<String, dynamic>> put(
    String path,
    Map<String, dynamic> body,
  ) async {
    final token = await _token();
    final response = await http.put(
      Uri.parse('$apiBaseUrl$path'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );
    return _decode(response);
  }

  static Future<Map<String, dynamic>> delete(String path) async {
    final token = await _token();
    final response = await http.delete(
      Uri.parse('$apiBaseUrl$path'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    return _decode(response);
  }

  static Map<String, dynamic> _decode(http.Response response) {
    final Map<String, dynamic> body = jsonDecode(response.body);
    if (response.statusCode >= 400 || body['is_error'] == true) {
      throw ApiException(body['message'] ?? 'Something went wrong');
    }
    return body;
  }
}
