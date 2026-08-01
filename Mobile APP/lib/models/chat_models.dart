class ChatAttachment {
  final int id;
  final String fileName;
  final String fileUrl;
  final String? mimeType;
  final int? fileSize;

  ChatAttachment({
    required this.id,
    required this.fileName,
    required this.fileUrl,
    this.mimeType,
    this.fileSize,
  });

  factory ChatAttachment.fromJson(Map<String, dynamic> json) {
    return ChatAttachment(
      id: json['id'],
      fileName: json['file_name'],
      fileUrl: json['file_url'],
      mimeType: json['mime_type'],
      fileSize: json['file_size'],
    );
  }
}

class ChatSession {
  final int id;
  final int taskId;
  final String? taskTitle;
  final int customerId;
  final int writerId;
  final String? otherPartyName;
  final bool isActive;
  final bool isBidAccepted;
  final DateTime? createdAt;

  ChatSession({
    required this.id,
    required this.taskId,
    this.taskTitle,
    required this.customerId,
    required this.writerId,
    this.otherPartyName,
    required this.isActive,
    this.isBidAccepted = false,
    this.createdAt,
  });

  factory ChatSession.fromJson(Map<String, dynamic> json) {
    return ChatSession(
      id: json['id'],
      taskId: json['task_id'],
      taskTitle: json['task_title'],
      customerId: json['customer_id'],
      writerId: json['writer_id'],
      otherPartyName: json['other_party_name'],
      isActive: json['is_active'] == true,
      isBidAccepted: json['is_bid_accepted'] == true,
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}

class ChatMessage {
  final int id;
  final int sessionId;
  final int senderId;
  final String messageText;
  final bool isRead;
  final DateTime? createdAt;
  final String messageType;
  final double? proposedAmount;
  final String? bidChangeStatus;
  final List<ChatAttachment> attachments;
  final String? senderName;

  ChatMessage({
    required this.id,
    required this.sessionId,
    required this.senderId,
    required this.messageText,
    required this.isRead,
    this.createdAt,
    this.messageType = 'TEXT',
    this.proposedAmount,
    this.bidChangeStatus,
    this.attachments = const [],
    this.senderName,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    final attachments = json['attachments'] as List<dynamic>? ?? [];
    return ChatMessage(
      id: json['id'],
      sessionId: json['session_id'],
      senderId: json['sender_id'],
      messageText: json['message_text'] ?? '',
      isRead: json['is_read'] == true,
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
      messageType: json['message_type'] ?? 'TEXT',
      proposedAmount: (json['proposed_amount'] as num?)?.toDouble(),
      bidChangeStatus: json['bid_change_status'],
      attachments: attachments.map((a) => ChatAttachment.fromJson(a)).toList(),
      senderName: json['sender_name'],
    );
  }
}

/// Admin oversight view of a chat session — richer than [ChatSession] since
/// the admin endpoint denormalizes both participant names.
class AdminChatSession {
  final int id;
  final int taskId;
  final String? taskTitle;
  final int customerId;
  final String? customerName;
  final int writerId;
  final String? writerName;
  final bool isActive;
  final int messageCount;
  final DateTime? createdAt;

  AdminChatSession({
    required this.id,
    required this.taskId,
    this.taskTitle,
    required this.customerId,
    this.customerName,
    required this.writerId,
    this.writerName,
    required this.isActive,
    required this.messageCount,
    this.createdAt,
  });

  factory AdminChatSession.fromJson(Map<String, dynamic> json) {
    return AdminChatSession(
      id: json['id'],
      taskId: json['task_id'],
      taskTitle: json['task_title'],
      customerId: json['customer_id'],
      customerName: json['customer_name'],
      writerId: json['writer_id'],
      writerName: json['writer_name'],
      isActive: json['is_active'] == true,
      messageCount: json['message_count'] ?? 0,
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
    );
  }
}
