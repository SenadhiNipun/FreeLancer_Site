import 'package:flutter/material.dart';
import '../../models/admin_models.dart';
import '../../services/api_client.dart';

/// Read-only list of a writer's or customer's tasks, used from their detail
/// screens ("View Tasks" action).
class AdminTaskListScreen extends StatelessWidget {
  final String title;
  final Future<List<AdminTaskSummary>> Function() loader;

  const AdminTaskListScreen({super.key, required this.title, required this.loader});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: FutureBuilder<List<AdminTaskSummary>>(
        future: loader(),
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
          final tasks = snapshot.data ?? [];
          if (tasks.isEmpty) {
            return const Center(child: Text('No tasks'));
          }
          return ListView.builder(
            itemCount: tasks.length,
            itemBuilder: (context, index) {
              final task = tasks[index];
              final subtitleParts = <String>[
                task.taskStatus,
                if (task.customerName != null) task.customerName!,
                if (task.writerName != null) task.writerName!,
              ];
              return ListTile(
                title: Text(task.title),
                subtitle: Text(subtitleParts.join(' · ')),
                trailing: task.budget != null
                    ? Text('\$${task.budget!.toStringAsFixed(2)}')
                    : null,
              );
            },
          );
        },
      ),
    );
  }
}
