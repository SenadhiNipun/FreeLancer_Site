import 'package:flutter/material.dart';
import '../../models/admin_models.dart';
import '../../services/admin_service.dart';
import '../../services/api_client.dart';
import 'admin_task_list_screen.dart';

class AdminWriterDetailScreen extends StatefulWidget {
  final AdminUser writer;

  const AdminWriterDetailScreen({super.key, required this.writer});

  @override
  State<AdminWriterDetailScreen> createState() => _AdminWriterDetailScreenState();
}

class _AdminWriterDetailScreenState extends State<AdminWriterDetailScreen> {
  late AdminUser _writer;
  bool _isActing = false;

  @override
  void initState() {
    super.initState();
    _writer = widget.writer;
  }

  Future<void> _runAction(Future<void> Function() action, String successMessage) async {
    setState(() => _isActing = true);
    try {
      await action();
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(successMessage)));
        Navigator.of(context).pop(true);
      }
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    } finally {
      if (mounted) setState(() => _isActing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = _writer.writerProfile;
    final isPending = _writer.profileStatusBucket == 'PENDING_APPROVAL';
    final isSuspended = _writer.status == 'SUSPENDED';

    return Scaffold(
      appBar: AppBar(title: Text(_writer.fullName)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(_writer.email, style: Theme.of(context).textTheme.bodyMedium),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              Chip(label: Text(_writer.profileStatusBucket)),
              Chip(label: Text(_writer.status)),
            ],
          ),
          const SizedBox(height: 16),
          Text('Tasks completed: ${_writer.taskCount}'),
          if (profile != null) ...[
            const Divider(height: 32),
            if (profile.bio != null) ...[
              Text('Bio', style: Theme.of(context).textTheme.titleSmall),
              Text(profile.bio!),
              const SizedBox(height: 12),
            ],
            if (profile.experienceYears != null)
              Text('Experience: ${profile.experienceYears} years'),
            if (profile.institutionName != null)
              Text('Institution: ${profile.institutionName}'),
            if (profile.academicCategory != null)
              Text('Category: ${profile.academicCategory}'),
            if (profile.specialization != null)
              Text('Specialization: ${profile.specialization}'),
            if (profile.city != null || profile.country != null)
              Text('Location: ${[profile.city, profile.country].whereType<String>().join(', ')}'),
            if (profile.qualifications.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text('Qualifications', style: Theme.of(context).textTheme.titleSmall),
              Wrap(
                spacing: 6,
                children: [
                  for (final q in profile.qualifications) Chip(label: Text(q)),
                ],
              ),
            ],
          ],
          const Divider(height: 32),
          OutlinedButton.icon(
            icon: const Icon(Icons.list_alt),
            label: const Text('View Tasks'),
            onPressed: () => Navigator.of(context).push(MaterialPageRoute(
              builder: (_) => AdminTaskListScreen(
                title: '${_writer.fullName}\'s tasks',
                loader: () => AdminService.getWriterTasks(_writer.id),
              ),
            )),
          ),
          const SizedBox(height: 16),
          if (isPending) ...[
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _isActing
                        ? null
                        : () => _runAction(
                            () => AdminService.rejectWriter(_writer.id), 'Writer rejected'),
                    child: const Text('Reject'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: _isActing
                        ? null
                        : () => _runAction(
                            () => AdminService.approveWriter(_writer.id), 'Writer approved'),
                    child: const Text('Approve'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
          ],
          FilledButton.tonal(
            onPressed: _isActing
                ? null
                : () => _runAction(
                      () => isSuspended
                          ? AdminService.activateUser(_writer.id)
                          : AdminService.suspendUser(_writer.id),
                      isSuspended ? 'Writer activated' : 'Writer suspended',
                    ),
            child: Text(isSuspended ? 'Activate' : 'Suspend'),
          ),
        ],
      ),
    );
  }
}
