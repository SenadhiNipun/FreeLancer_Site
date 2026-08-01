class Bid {
  final int id;
  final int taskId;
  final double bidAmount;
  final String? message;
  final String bidStatus;
  final String writerName;
  final String? taskTitle;
  final String? taskStatus;

  Bid({
    required this.id,
    required this.taskId,
    required this.bidAmount,
    required this.message,
    required this.bidStatus,
    required this.writerName,
    this.taskTitle,
    this.taskStatus,
  });

  factory Bid.fromJson(Map<String, dynamic> json) {
    final writer = json['writer'] as Map<String, dynamic>?;
    final writerName = writer == null
        ? 'Unknown writer'
        : '${writer['first_name']} ${writer['last_name'] ?? ''}'.trim();
    final task = json['task'] as Map<String, dynamic>?;

    return Bid(
      id: json['id'],
      taskId: json['task_id'],
      bidAmount: (json['bid_amount'] as num).toDouble(),
      message: json['message'],
      bidStatus: json['bid_status'],
      writerName: writerName,
      taskTitle: task?['title'],
      taskStatus: task?['task_status'],
    );
  }
}
