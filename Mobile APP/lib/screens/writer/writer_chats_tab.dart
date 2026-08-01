import 'dart:async';
import 'package:flutter/material.dart';
import '../../models/chat_models.dart';
import '../../services/api_client.dart';
import '../../services/chat_service.dart';
import '../chat/chat_screen.dart';

class WriterChatsTab extends StatefulWidget {
  const WriterChatsTab({super.key});

  @override
  State<WriterChatsTab> createState() => _WriterChatsTabState();
}

class _WriterChatsTabState extends State<WriterChatsTab> {
  List<ChatSession>? _sessions;
  String? _errorMessage;
  Timer? _pollTimer;

  @override
  void initState() {
    super.initState();
    _load();
    _pollTimer = Timer.periodic(const Duration(seconds: 10), (_) => _load());
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    try {
      final sessions = await ChatService.getSessions();
      if (mounted) setState(() => _sessions = sessions);
    } on ApiException catch (e) {
      if (mounted) setState(() => _errorMessage = e.message);
    } catch (_) {
      if (mounted) setState(() => _errorMessage = 'Could not load chats');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_sessions == null && _errorMessage == null) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_sessions == null) {
      return Center(child: Text(_errorMessage!));
    }
    if (_sessions!.isEmpty) {
      return const Center(child: Text('No conversations yet'));
    }
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        itemCount: _sessions!.length,
        itemBuilder: (context, index) {
          final session = _sessions![index];
          return ListTile(
            leading: const Icon(Icons.chat_bubble_outline),
            title: Text(session.otherPartyName ?? 'Customer'),
            subtitle: Text(session.taskTitle ?? 'Task #${session.taskId}'),
            onTap: () => Navigator.of(context).push(MaterialPageRoute(
              builder: (_) => ChatScreen(
                sessionId: session.id,
                viewerRole: 'WRITER',
                title: session.otherPartyName ?? 'Chat',
              ),
            )),
          );
        },
      ),
    );
  }
}
