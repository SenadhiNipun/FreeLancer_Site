import '../models/bid.dart';
import '../models/task.dart';
import 'api_client.dart';

class WriterService {
  static Future<List<Task>> getOpenTasks() async {
    final response = await ApiClient.get('/api/v1/writer/tasks/open');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => Task.fromJson(json)).toList();
  }

  static Future<List<Task>> getMyTasks() async {
    final response = await ApiClient.get('/api/v1/writer/tasks');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => Task.fromJson(json)).toList();
  }

  static Future<Task> getTask(int taskId) async {
    final response = await ApiClient.get('/api/v1/writer/tasks/$taskId');
    return Task.fromJson(response['results']);
  }

  static Future<void> placeBid(
    int taskId,
    double bidAmount,
    String? message,
  ) async {
    await ApiClient.post('/api/v1/writer/tasks/$taskId/bids', {
      'bid_amount': bidAmount,
      if (message != null && message.isNotEmpty) 'message': message,
    });
  }

  static Future<List<Bid>> getMyBids() async {
    final response = await ApiClient.get('/api/v1/writer/bids');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => Bid.fromJson(json)).toList();
  }

  static Future<void> withdrawBid(int bidId) async {
    await ApiClient.delete('/api/v1/writer/bids/$bidId');
  }

  static Future<void> submitTask(
    int taskId, {
    required String submissionNote,
    required bool isFinal,
  }) async {
    await ApiClient.postForm('/api/v1/writer/tasks/$taskId/submit', {
      'submission_note': submissionNote,
      'is_final': isFinal.toString(),
    });
  }
}
