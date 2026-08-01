import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_client.dart';

class AuthService {
  static Future<List<String>> login(String email, String password) async {
    final response = await ApiClient.post('/api/v1/auth/login', {
      'email': email,
      'password': password,
    });
    final results = response['results'] as Map<String, dynamic>;
    final roles = (results['roles'] as List<dynamic>? ?? [])
        .map((r) => r.toString())
        .toList();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', results['access_token']);
    await prefs.setString('refresh_token', results['refresh_token']);
    await prefs.setString('email', results['email']);
    await prefs.setString('roles', jsonEncode(roles));
    await prefs.setInt('user_id', results['user_id']);

    return roles;
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
    await prefs.remove('email');
    await prefs.remove('roles');
    await prefs.remove('user_id');
  }

  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token') != null;
  }

  static Future<List<String>> getRoles() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('roles');
    if (raw == null) return [];
    return (jsonDecode(raw) as List<dynamic>).map((r) => r.toString()).toList();
  }

  static Future<int?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('user_id');
  }
}
