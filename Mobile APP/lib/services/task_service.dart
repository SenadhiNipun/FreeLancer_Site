import '../models/bid.dart';
import '../models/task.dart';
import 'api_client.dart';

class TaskService {
  static Future<List<Task>> getMyTasks() async {
    final response = await ApiClient.get('/api/v1/customer/tasks');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => Task.fromJson(json)).toList();
  }

  static Future<Task> getTask(int taskId) async {
    final response = await ApiClient.get('/api/v1/customer/tasks/$taskId');
    return Task.fromJson(response['results']);
  }

  static Future<List<Bid>> getBids(int taskId) async {
    final response = await ApiClient.get(
      '/api/v1/customer/tasks/$taskId/bids',
    );
    final results = response['results'] as List<dynamic>;
    return results.map((json) => Bid.fromJson(json)).toList();
  }

  static Future<void> acceptBid(int taskId, int bidId) async {
    await ApiClient.post(
      '/api/v1/customer/tasks/$taskId/bids/$bidId/accept',
      {},
    );
  }

  static Future<void> approveTask(int taskId) async {
    await ApiClient.post('/api/v1/customer/tasks/$taskId/approve', {});
  }

  static Future<void> requestRevision(int taskId, String note) async {
    await ApiClient.postForm(
      '/api/v1/customer/tasks/$taskId/request-revision',
      {'revision_note': note},
    );
  }

  static Future<void> createTask({
    required String title,
    required String description,
    required DateTime deadline,
    double? budget,
    bool isUrgent = false,
  }) async {
    await ApiClient.post('/api/v1/customer/tasks', {
      'title': title,
      'description': description,
      'deadline': deadline.toIso8601String(),
      'budget': budget,
      'is_urgent': isUrgent,
    });
  }
}
