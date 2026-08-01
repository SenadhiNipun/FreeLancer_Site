import 'bid.dart';

class Task {
  final int id;
  final String title;
  final String description;
  final String taskStatus;
  final DateTime deadline;
  final double? budget;

  final String? paymentStatus;
  final bool isUrgent;
  final String? customerName;
  final int? writerId;
  final String? writerName;
  final String? academicCategoryName;
  final int filesCount;
  final Bid? myBid;
  final double? reviewRating;
  final String? reviewFeedback;

  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.taskStatus,
    required this.deadline,
    required this.budget,
    this.paymentStatus,
    this.isUrgent = false,
    this.customerName,
    this.writerId,
    this.writerName,
    this.academicCategoryName,
    this.filesCount = 0,
    this.myBid,
    this.reviewRating,
    this.reviewFeedback,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    final customer = json['customer'] as Map<String, dynamic>?;
    final writer = json['writer'] as Map<String, dynamic>?;
    final academicCategory = json['academic_category'] as Map<String, dynamic>?;
    final review = json['review'] as Map<String, dynamic>?;
    final files = json['files'] as List<dynamic>?;
    final myBid = json['my_bid'] as Map<String, dynamic>?;

    String? nameFrom(Map<String, dynamic>? user) {
      if (user == null) return null;
      final name = '${user['first_name'] ?? ''} ${user['last_name'] ?? ''}'.trim();
      return name.isEmpty ? null : name;
    }

    return Task(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      taskStatus: json['task_status'],
      deadline: DateTime.parse(json['deadline']),
      budget: (json['budget'] as num?)?.toDouble(),
      paymentStatus: json['payment_status'],
      isUrgent: json['is_urgent'] == true,
      customerName: nameFrom(customer),
      writerId: writer?['id'],
      writerName: nameFrom(writer),
      academicCategoryName: academicCategory?['name'],
      filesCount: files?.length ?? 0,
      myBid: myBid == null ? null : Bid.fromJson(myBid),
      reviewRating: (review?['rating'] as num?)?.toDouble(),
      reviewFeedback: review?['feedback'],
    );
  }
}
