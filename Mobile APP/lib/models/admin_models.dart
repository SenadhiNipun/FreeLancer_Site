class PlatformStats {
  final int totalCustomers;
  final int totalWriters;
  final int pendingWriters;
  final int totalTasks;
  final int activeTasks;
  final int completedTasks;
  final double totalRevenue;

  PlatformStats({
    required this.totalCustomers,
    required this.totalWriters,
    required this.pendingWriters,
    required this.totalTasks,
    required this.activeTasks,
    required this.completedTasks,
    required this.totalRevenue,
  });

  factory PlatformStats.fromJson(Map<String, dynamic> json) {
    return PlatformStats(
      totalCustomers: json['total_customers'] ?? 0,
      totalWriters: json['total_writers'] ?? 0,
      pendingWriters: json['pending_writers'] ?? 0,
      totalTasks: json['total_tasks'] ?? 0,
      activeTasks: json['active_tasks'] ?? 0,
      completedTasks: json['completed_tasks'] ?? 0,
      totalRevenue: (json['total_revenue'] as num?)?.toDouble() ?? 0,
    );
  }
}

class WriterProfileSummary {
  final String? profileStatus;
  final String? bio;
  final int? experienceYears;
  final String? city;
  final String? country;
  final String? institutionName;
  final String? academicStatus;
  final String? educationLevel;
  final String? academicCategory;
  final String? specialization;
  final List<String> qualifications;

  WriterProfileSummary({
    this.profileStatus,
    this.bio,
    this.experienceYears,
    this.city,
    this.country,
    this.institutionName,
    this.academicStatus,
    this.educationLevel,
    this.academicCategory,
    this.specialization,
    this.qualifications = const [],
  });

  factory WriterProfileSummary.fromJson(Map<String, dynamic> json) {
    return WriterProfileSummary(
      profileStatus: json['profile_status'],
      bio: json['bio'],
      experienceYears: json['experience_years'],
      city: json['city'],
      country: json['country'],
      institutionName: json['institution_name'],
      academicStatus: json['academic_status'],
      educationLevel: json['education_level'],
      academicCategory: json['academic_category'],
      specialization: json['specialization'],
      qualifications: (json['qualifications'] as List<dynamic>? ?? [])
          .map((q) => q.toString())
          .toList(),
    );
  }
}

class AdminUser {
  final int id;
  final String firstName;
  final String? lastName;
  final String email;
  final String status;
  final bool isEmailVerified;
  final DateTime? createdAt;
  final DateTime? lastLoginAt;
  final String? profileImageUrl;
  final int taskCount;
  final WriterProfileSummary? writerProfile;

  AdminUser({
    required this.id,
    required this.firstName,
    this.lastName,
    required this.email,
    required this.status,
    required this.isEmailVerified,
    this.createdAt,
    this.lastLoginAt,
    this.profileImageUrl,
    required this.taskCount,
    this.writerProfile,
  });

  String get fullName => '$firstName ${lastName ?? ''}'.trim();

  /// Bucket used for the Writers filter tabs; mirrors the web app's fallback.
  String get profileStatusBucket => writerProfile?.profileStatus ?? 'INCOMPLETE';

  factory AdminUser.fromJson(Map<String, dynamic> json) {
    final writerProfile = json['writer_profile'] as Map<String, dynamic>?;
    return AdminUser(
      id: json['id'],
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'],
      email: json['email'],
      status: json['status'] ?? 'ACTIVE',
      isEmailVerified: json['is_email_verified'] == true,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'])
          : null,
      lastLoginAt: json['last_login_at'] != null
          ? DateTime.tryParse(json['last_login_at'])
          : null,
      profileImageUrl: json['profile_image_url'],
      taskCount: json['task_count'] ?? 0,
      writerProfile:
          writerProfile == null ? null : WriterProfileSummary.fromJson(writerProfile),
    );
  }
}

class AdminTaskSummary {
  final int id;
  final String title;
  final String taskStatus;
  final String? paymentStatus;
  final double? budget;
  final DateTime? deadline;
  final DateTime? createdAt;
  final String? customerName;
  final String? writerName;
  final double? bidAmount;
  final String? bidStatus;

  AdminTaskSummary({
    required this.id,
    required this.title,
    required this.taskStatus,
    this.paymentStatus,
    this.budget,
    this.deadline,
    this.createdAt,
    this.customerName,
    this.writerName,
    this.bidAmount,
    this.bidStatus,
  });

  factory AdminTaskSummary.fromJson(Map<String, dynamic> json) {
    return AdminTaskSummary(
      id: json['id'],
      title: json['title'],
      taskStatus: json['task_status'],
      paymentStatus: json['payment_status'],
      budget: (json['budget'] as num?)?.toDouble(),
      deadline: json['deadline'] != null ? DateTime.tryParse(json['deadline']) : null,
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
      customerName: json['customer_name'],
      writerName: json['writer_name'],
      bidAmount: (json['bid_amount'] as num?)?.toDouble(),
      bidStatus: json['bid_status'],
    );
  }
}
