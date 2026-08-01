import '../models/chat_models.dart';
import 'api_client.dart';

class ChatService {
  static Future<List<ChatSession>> getSessions() async {
    final response = await ApiClient.get('/api/v1/chat/sessions');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => ChatSession.fromJson(json)).toList();
  }

  static Future<List<ChatMessage>> getMessages(int sessionId) async {
    final response = await ApiClient.get('/api/v1/chat/sessions/$sessionId/messages');
    final results = response['results'] as List<dynamic>;
    return results.map((json) => ChatMessage.fromJson(json)).toList();
  }

  static Future<ChatMessage> sendMessage(
    int sessionId,
    String text, {
    String messageType = 'TEXT',
    double? proposedAmount,
  }) async {
    final response = await ApiClient.post(
      '/api/v1/chat/sessions/$sessionId/messages',
      {
        'message_text': text,
        'message_type': messageType,
        'proposed_amount': ?proposedAmount,
      },
    );
    return ChatMessage.fromJson(response['results']);
  }

  static Future<int> initializeChat(int taskId, int writerId) async {
    final response = await ApiClient.post(
      '/api/v1/chat/sessions/initialize?task_id=$taskId&writer_id=$writerId',
      {},
    );
    return response['results']['id'];
  }

  static Future<ChatMessage> respondToBidChange(int messageId, String action) async {
    final response = await ApiClient.post(
      '/api/v1/chat/messages/$messageId/respond-bid-change?action=$action',
      {},
    );
    return ChatMessage.fromJson(response['results']);
  }

  static Future<void> toggleSession(int sessionId) async {
    await ApiClient.put('/api/v1/chat/sessions/$sessionId/toggle', {});
  }
}
