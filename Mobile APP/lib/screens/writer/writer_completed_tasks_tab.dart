import 'package:flutter/material.dart';
import '../../models/task.dart';
import '../../services/api_client.dart';
import '../../services/writer_service.dart';

class WriterCompletedTasksTab extends StatefulWidget {
  const WriterCompletedTasksTab({super.key});

  @override
  State<WriterCompletedTasksTab> createState() => _WriterCompletedTasksTabState();
}

class _WriterCompletedTasksTabState extends State<WriterCompletedTasksTab> {
  late Future<List<Task>> _tasksFuture;

  @override
  void initState() {
    super.initState();
    _tasksFuture = _load();
  }

  Future<List<Task>> _load() async {
    final tasks = await WriterService.getMyTasks();
    return tasks.where((t) => t.taskStatus == 'COMPLETED').toList();
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
              : 'Could not load completed tasks';
          return Center(child: Text(message));
        }
        final tasks = snapshot.data ?? [];
        if (tasks.isEmpty) {
          return const Center(child: Text('No completed tasks yet'));
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
                  task.reviewRating != null
                      ? 'Rating ${task.reviewRating!.toStringAsFixed(1)} / 5'
                      : 'No review yet',
                ),
                trailing: task.budget != null
                    ? Text('\$${task.budget!.toStringAsFixed(2)}')
                    : null,
              );
            },
          ),
        );
      },
    );
  }
}
