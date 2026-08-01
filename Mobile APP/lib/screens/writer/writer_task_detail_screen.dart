import 'package:flutter/material.dart';
import '../../models/task.dart';
import '../../services/api_client.dart';
import '../../services/chat_service.dart';
import '../../services/writer_service.dart';
import '../chat/chat_screen.dart';

const _submittableStatuses = {'ASSIGNED', 'IN_PROGRESS', 'REVISION_REQUESTED'};

class WriterTaskDetailScreen extends StatefulWidget {
  final int taskId;

  const WriterTaskDetailScreen({super.key, required this.taskId});

  @override
  State<WriterTaskDetailScreen> createState() => _WriterTaskDetailScreenState();
}

class _WriterTaskDetailScreenState extends State<WriterTaskDetailScreen> {
  Task? _task;
  bool _isLoading = true;
  bool _isActing = false;
  bool _isFindingChat = false;
  String? _errorMessage;
  final _noteController = TextEditingController();
  bool _isFinal = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() => _isLoading = true);
    try {
      final task = await WriterService.getTask(widget.taskId);
      setState(() {
        _task = task;
        _errorMessage = null;
      });
    } on ApiException catch (e) {
      setState(() => _errorMessage = e.message);
    } catch (e) {
      setState(() => _errorMessage = 'Could not reach the server');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _submit() async {
    if (_noteController.text.trim().isEmpty) return;
    setState(() => _isActing = true);
    try {
      await WriterService.submitTask(
        widget.taskId,
        submissionNote: _noteController.text.trim(),
        isFinal: _isFinal,
      );
      _noteController.clear();
      await _load();
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('Work submitted')));
      }
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    } finally {
      if (mounted) setState(() => _isActing = false);
    }
  }

  Future<void> _openChatWithCustomer() async {
    setState(() => _isFindingChat = true);
    try {
      final sessions = await ChatService.getSessions();
      final match = sessions.where((s) => s.taskId == widget.taskId).toList();
      if (!mounted) return;
      if (match.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text("The customer hasn't started a chat for this task yet"),
        ));
        return;
      }
      Navigator.of(context).push(MaterialPageRoute(
        builder: (_) => ChatScreen(
          sessionId: match.first.id,
          viewerRole: 'WRITER',
          title: match.first.otherPartyName ?? 'Customer',
        ),
      ));
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    } finally {
      if (mounted) setState(() => _isFindingChat = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_task?.title ?? 'Task'),
        actions: [
          IconButton(
            icon: _isFindingChat
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.chat_bubble_outline),
            onPressed: _isFindingChat ? null : _openChatWithCustomer,
          ),
        ],
      ),
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
          Text('Deadline: ${task.deadline.toLocal().toString().split(' ').first}'),
          if (task.budget != null)
            Text('Budget: \$${task.budget!.toStringAsFixed(2)}'),
          if (task.customerName != null) Text('Customer: ${task.customerName}'),
          if (task.reviewRating != null) ...[
            const Divider(height: 32),
            Text('Review', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Text('Rating: ${task.reviewRating!.toStringAsFixed(1)} / 5'),
            if (task.reviewFeedback != null) Text(task.reviewFeedback!),
          ],
          if (_submittableStatuses.contains(task.taskStatus)) ...[
            const Divider(height: 32),
            Text('Submit work', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            TextField(
              controller: _noteController,
              decoration: const InputDecoration(
                labelText: 'Submission note',
              ),
              maxLines: 4,
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('This is my final submission'),
              value: _isFinal,
              onChanged: (v) => setState(() => _isFinal = v),
            ),
            const SizedBox(height: 8),
            FilledButton(
              onPressed: _isActing ? null : _submit,
              child: _isActing
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Submit'),
            ),
          ],
        ],
      ),
    );
  }
}
