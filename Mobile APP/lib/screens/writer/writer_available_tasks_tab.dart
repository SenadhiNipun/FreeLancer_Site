import 'package:flutter/material.dart';
import '../../models/task.dart';
import '../../services/api_client.dart';
import '../../services/writer_service.dart';

class WriterAvailableTasksTab extends StatefulWidget {
  const WriterAvailableTasksTab({super.key});

  @override
  State<WriterAvailableTasksTab> createState() => _WriterAvailableTasksTabState();
}

class _WriterAvailableTasksTabState extends State<WriterAvailableTasksTab> {
  late Future<List<Task>> _tasksFuture;

  @override
  void initState() {
    super.initState();
    _tasksFuture = WriterService.getOpenTasks();
  }

  void _refresh() {
    setState(() {
      _tasksFuture = WriterService.getOpenTasks();
    });
  }

  Future<void> _placeBid(Task task) async {
    final amountController = TextEditingController(
      text: task.myBid?.bidAmount.toStringAsFixed(2),
    );
    final messageController = TextEditingController(text: task.myBid?.message);

    final amount = await showDialog<double>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(task.myBid == null ? 'Place bid' : 'Update bid'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Bid amount (\$)'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: messageController,
              decoration: const InputDecoration(labelText: 'Message (optional)'),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () =>
                Navigator.of(context).pop(double.tryParse(amountController.text)),
            child: const Text('Submit'),
          ),
        ],
      ),
    );
    if (amount == null || amount <= 0) return;

    try {
      await WriterService.placeBid(task.id, amount, messageController.text.trim());
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('Bid placed')));
      }
      _refresh();
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    }
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
              : 'Could not load open tasks';
          return Center(child: Text(message));
        }
        final tasks = snapshot.data ?? [];
        if (tasks.isEmpty) {
          return const Center(child: Text('No open tasks right now'));
        }
        return RefreshIndicator(
          onRefresh: () async => _refresh(),
          child: ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: tasks.length,
            itemBuilder: (context, index) {
              final task = tasks[index];
              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          if (task.academicCategoryName != null)
                            Chip(label: Text(task.academicCategoryName!)),
                          if (task.isUrgent) ...[
                            const SizedBox(width: 6),
                            Chip(
                              label: const Text('Urgent'),
                              backgroundColor: Theme.of(context).colorScheme.errorContainer,
                              labelStyle: TextStyle(
                                color: Theme.of(context).colorScheme.onErrorContainer,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                          if (task.myBid != null) ...[
                            const SizedBox(width: 6),
                            const Chip(label: Text('Bid placed')),
                          ],
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(task.title,
                          style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 4),
                      Text(
                        task.description,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Due ${task.deadline.toLocal().toString().split(' ').first} · '
                        '${task.filesCount} file(s)'
                        '${task.budget != null ? ' · \$${task.budget!.toStringAsFixed(2)}' : ''}',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(height: 8),
                      Align(
                        alignment: Alignment.centerRight,
                        child: OutlinedButton(
                          onPressed: () => _placeBid(task),
                          child: Text(task.myBid == null ? 'Place Bid' : 'Update Bid'),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
