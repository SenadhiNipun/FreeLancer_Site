import 'package:flutter/material.dart';
import '../models/bid.dart';
import '../models/task.dart';
import '../services/api_client.dart';
import '../services/chat_service.dart';
import '../services/task_service.dart';
import 'chat/chat_screen.dart';

class TaskDetailScreen extends StatefulWidget {
  final int taskId;

  const TaskDetailScreen({super.key, required this.taskId});

  @override
  State<TaskDetailScreen> createState() => _TaskDetailScreenState();
}

class _TaskDetailScreenState extends State<TaskDetailScreen> {
  Task? _task;
  List<Bid> _bids = [];
  bool _isLoading = true;
  bool _isActing = false;
  bool _isOpeningChat = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _isLoading = true);
    try {
      final task = await TaskService.getTask(widget.taskId);
      List<Bid> bids = [];
      if (task.taskStatus == 'OPEN') {
        bids = await TaskService.getBids(widget.taskId);
      }
      setState(() {
        _task = task;
        _bids = bids;
      });
    } on ApiException catch (e) {
      setState(() => _errorMessage = e.message);
    } catch (e) {
      setState(() => _errorMessage = 'Could not reach the server');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _runAction(Future<void> Function() action) async {
    setState(() => _isActing = true);
    try {
      await action();
      await _load();
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(e.message)));
      }
    } finally {
      if (mounted) setState(() => _isActing = false);
    }
  }

  Future<void> _acceptBid(Bid bid) {
    return _runAction(() => TaskService.acceptBid(widget.taskId, bid.id));
  }

  Future<void> _openChatWithWriter() async {
    final writerId = _task?.writerId;
    if (writerId == null) return;
    setState(() => _isOpeningChat = true);
    try {
      final sessionId = await ChatService.initializeChat(widget.taskId, writerId);
      if (!mounted) return;
      await Navigator.of(context).push(MaterialPageRoute(
        builder: (_) => ChatScreen(
          sessionId: sessionId,
          viewerRole: 'CUSTOMER',
          title: _task?.writerName ?? 'Writer',
        ),
      ));
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    } finally {
      if (mounted) setState(() => _isOpeningChat = false);
    }
  }

  Future<void> _approveTask() {
    return _runAction(() => TaskService.approveTask(widget.taskId));
  }

  Future<void> _requestRevision() async {
    final controller = TextEditingController();
    final note = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Request revision'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(labelText: 'What needs fixing?'),
          maxLines: 3,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(controller.text),
            child: const Text('Send'),
          ),
        ],
      ),
    );
    if (note == null || note.trim().isEmpty) return;
    await _runAction(
      () => TaskService.requestRevision(widget.taskId, note.trim()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_task?.title ?? 'Task')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
          ? Center(child: Text(_errorMessage!))
          : _buildContent(),
    );
  }

  Widget _buildContent() {
    final task = _task!;
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Chip(label: Text(task.taskStatus)),
          const SizedBox(height: 12),
          Text(task.description),
          const SizedBox(height: 16),
          Text(
            'Deadline: ${task.deadline.toLocal().toString().split(' ').first}',
          ),
          if (task.budget != null)
            Text('Budget: \$${task.budget!.toStringAsFixed(2)}'),
          if (task.writerId != null) ...[
            const SizedBox(height: 16),
            OutlinedButton.icon(
              icon: _isOpeningChat
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.chat_bubble_outline),
              label: Text('Message ${task.writerName ?? 'Writer'}'),
              onPressed: _isOpeningChat ? null : _openChatWithWriter,
            ),
          ],
          const Divider(height: 32),
          if (task.taskStatus == 'OPEN') ..._buildBidsSection(),
          if (task.taskStatus == 'SUBMITTED') ..._buildSubmittedActions(),
        ],
      ),
    );
  }

  List<Widget> _buildBidsSection() {
    return [
      Text('Bids', style: Theme.of(context).textTheme.titleMedium),
      const SizedBox(height: 8),
      if (_bids.isEmpty) const Text('No bids yet'),
      for (final bid in _bids)
        Card(
          child: ListTile(
            title: Text(bid.writerName),
            subtitle: Text(bid.message ?? ''),
            trailing: Text('\$${bid.bidAmount.toStringAsFixed(2)}'),
            onTap: _isActing ? null : () => _acceptBid(bid),
          ),
        ),
    ];
  }

  List<Widget> _buildSubmittedActions() {
    return [
      Text('Work submitted', style: Theme.of(context).textTheme.titleMedium),
      const SizedBox(height: 12),
      Row(
        children: [
          Expanded(
            child: FilledButton(
              onPressed: _isActing ? null : _approveTask,
              child: const Text('Approve'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: OutlinedButton(
              onPressed: _isActing ? null : _requestRevision,
              child: const Text('Request revision'),
            ),
          ),
        ],
      ),
    ];
  }
}
