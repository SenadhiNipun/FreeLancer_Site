import 'package:flutter/material.dart';
import '../../models/task.dart';
import '../../services/api_client.dart';
import '../../services/writer_service.dart';
import 'writer_task_detail_screen.dart';

class WriterActiveTasksTab extends StatefulWidget {
  const WriterActiveTasksTab({super.key});

  @override
  State<WriterActiveTasksTab> createState() => _WriterActiveTasksTabState();
}

class _WriterActiveTasksTabState extends State<WriterActiveTasksTab> {
  late Future<List<Task>> _tasksFuture;

  @override
  void initState() {
    super.initState();
    _tasksFuture = _load();
  }

  Future<List<Task>> _load() async {
    final tasks = await WriterService.getMyTasks();
    return tasks
        .where((t) => t.taskStatus != 'COMPLETED' && t.taskStatus != 'CANCELLED')
        .toList();
  }

  void _refresh() {
    setState(() {
      _tasksFuture = _load();
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Task>>(
      future: _tasksFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          final message = snapshot.error is ApiException
              ? (snapshot.error as ApiException).message
              : 'Could not load active tasks';
          return Center(child: Text(message));
        }
        final tasks = snapshot.data ?? [];
        if (tasks.isEmpty) {
          return const Center(child: Text('No active tasks'));
        }
        return RefreshIndicator(
          onRefresh: () async => _refresh(),
          child: ListView.builder(
            itemCount: tasks.length,
            itemBuilder: (context, index) {
              final task = tasks[index];
              return ListTile(
                title: Text(task.title),
                subtitle: Text(
                  '${task.taskStatus} · Due ${task.deadline.toLocal().toString().split(' ').first}'
                  '${task.customerName != null ? ' · ${task.customerName}' : ''}',
                ),
                trailing: task.budget != null
                    ? Text('\$${task.budget!.toStringAsFixed(2)}')
                    : null,
                onTap: () async {
                  await Navigator.of(context).push(MaterialPageRoute(
                    builder: (_) => WriterTaskDetailScreen(taskId: task.id),
                  ));
                  _refresh();
                },
              );
            },
          ),
        );
      },
    );
  }
}
