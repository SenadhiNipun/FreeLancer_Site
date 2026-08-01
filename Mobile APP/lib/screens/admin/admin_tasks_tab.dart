import 'package:flutter/material.dart';
import '../../models/admin_models.dart';
import '../../services/admin_service.dart';
import '../../services/api_client.dart';

/// (label, status query param — null means the backend's default "confirmed" set)
const _filters = <(String, String?)>[
  ('Confirmed', null),
  ('Assigned', 'ASSIGNED'),
  ('In Progress', 'IN_PROGRESS'),
  ('Submitted', 'SUBMITTED'),
  ('Revision', 'REVISION_REQUESTED'),
  ('Completed', 'COMPLETED'),
  ('All', 'ALL'),
];

class AdminTasksTab extends StatefulWidget {
  const AdminTasksTab({super.key});

  @override
  State<AdminTasksTab> createState() => _AdminTasksTabState();
}

class _AdminTasksTabState extends State<AdminTasksTab> {
  late Future<List<AdminTaskSummary>> _future;
  int _filterIndex = 0;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _future = AdminService.getAllTasks(status: _filters[0].$2);
  }

  void _applyFilter(int index) {
    setState(() {
      _filterIndex = index;
      _future = AdminService.getAllTasks(status: _filters[index].$2);
    });
  }

  void _showDetail(AdminTaskSummary task) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(task.title, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),
            Chip(label: Text(task.taskStatus)),
            const SizedBox(height: 12),
            if (task.customerName != null) Text('Customer: ${task.customerName}'),
            Text('Writer: ${task.writerName ?? 'Unassigned'}'),
            if (task.budget != null) Text('Budget: \$${task.budget!.toStringAsFixed(2)}'),
            if (task.paymentStatus != null) Text('Payment: ${task.paymentStatus}'),
            if (task.deadline != null)
              Text('Deadline: ${task.deadline!.toLocal().toString().split(' ').first}'),
            if (task.createdAt != null)
              Text('Uploaded: ${task.createdAt!.toLocal().toString().split(' ').first}'),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 12, 12, 8),
          child: TextField(
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.search),
              hintText: 'Search by title, customer, or writer',
              isDense: true,
            ),
            onChanged: (v) => setState(() => _query = v.toLowerCase()),
          ),
        ),
        SizedBox(
          height: 40,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            itemCount: _filters.length,
            itemBuilder: (context, index) => Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ChoiceChip(
                label: Text(_filters[index].$1),
                selected: _filterIndex == index,
                onSelected: (_) => _applyFilter(index),
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: FutureBuilder<List<AdminTaskSummary>>(
            future: _future,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }
              if (snapshot.hasError) {
                final message = snapshot.error is ApiException
                    ? (snapshot.error as ApiException).message
                    : 'Could not load tasks';
                return Center(child: Text(message));
              }
              var tasks = snapshot.data ?? [];
              if (_query.isNotEmpty) {
                tasks = tasks
                    .where((t) =>
                        t.title.toLowerCase().contains(_query) ||
                        (t.customerName?.toLowerCase().contains(_query) ?? false) ||
                        (t.writerName?.toLowerCase().contains(_query) ?? false))
                    .toList();
              }
              if (tasks.isEmpty) {
                return const Center(child: Text('No tasks found'));
              }
              return ListView.builder(
                itemCount: tasks.length,
                itemBuilder: (context, index) {
                  final task = tasks[index];
                  return ListTile(
                    title: Text('${task.title} (#${task.id})'),
                    subtitle: Text(
                      '${task.taskStatus} · ${task.customerName ?? 'Unknown'} → ${task.writerName ?? 'Unassigned'}',
                    ),
                    trailing: task.budget != null
                        ? Text('\$${task.budget!.toStringAsFixed(2)}')
                        : null,
                    onTap: () => _showDetail(task),
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }
}
