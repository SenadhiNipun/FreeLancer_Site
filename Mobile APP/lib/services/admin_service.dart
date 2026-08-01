import '../models/admin_models.dart';
import '../models/chat_models.dart';
import 'api_client.dart';

class AdminService {
  static Future<PlatformStats> getStats() async {
    final response = await ApiClient.get('/api/v1/admin/stats');
    return PlatformStats.fromJson(response['results']);
  }

  static Future<List<AdminUser>> getAllWriters() async {
    final response = await ApiClient.get('/api/v1/admin/writers');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => AdminUser.fromJson(json)).toList();
  }

  static Future<List<AdminUser>> getPendingWriters() async {
    final response = await ApiClient.get('/api/v1/admin/writers/pending');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => AdminUser.fromJson(json)).toList();
  }

  static Future<void> approveWriter(int writerId) async {
    await ApiClient.post('/api/v1/admin/writers/$writerId/approve', {});
  }

  static Future<void> rejectWriter(int writerId) async {
    await ApiClient.post('/api/v1/admin/writers/$writerId/reject', {});
  }

  static Future<List<AdminUser>> getAllCustomers() async {
    final response = await ApiClient.get('/api/v1/admin/customers');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => AdminUser.fromJson(json)).toList();
  }

  static Future<void> suspendUser(int userId) async {
    await ApiClient.post('/api/v1/admin/users/$userId/suspend', {});
  }

  static Future<void> activateUser(int userId) async {
    await ApiClient.post('/api/v1/admin/users/$userId/activate', {});
  }

  static Future<List<AdminTaskSummary>> getAllTasks({String? status}) async {
    final query = status != null ? '?status=$status' : '';
    final response = await ApiClient.get('/api/v1/admin/tasks$query');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => AdminTaskSummary.fromJson(json)).toList();
  }

  static Future<List<AdminTaskSummary>> getWriterTasks(int writerId) async {
    final response = await ApiClient.get('/api/v1/admin/writers/$writerId/tasks');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => AdminTaskSummary.fromJson(json)).toList();
  }

  static Future<List<AdminTaskSummary>> getCustomerTasks(int customerId) async {
    final response = await ApiClient.get('/api/v1/admin/customers/$customerId/tasks');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => AdminTaskSummary.fromJson(json)).toList();
  }

  static Future<List<AdminChatSession>> getAllChatSessions() async {
    final response = await ApiClient.get('/api/v1/admin/chats');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => AdminChatSession.fromJson(json)).toList();
  }

  static Future<List<ChatMessage>> getChatMessages(int sessionId) async {
    final response = await ApiClient.get('/api/v1/admin/chats/$sessionId/messages');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => ChatMessage.fromJson(json)).toList();
  }
}
