import 'package:flutter/material.dart';
import '../../models/chat_models.dart';
import '../../services/admin_service.dart';
import '../../services/api_client.dart';
import '../chat/chat_screen.dart';

class AdminChatsTab extends StatefulWidget {
  const AdminChatsTab({super.key});

  @override
  State<AdminChatsTab> createState() => _AdminChatsTabState();
}

class _AdminChatsTabState extends State<AdminChatsTab> {
  late Future<List<AdminChatSession>> _future;

  @override
  void initState() {
    super.initState();
    _future = AdminService.getAllChatSessions();
  }

  void _refresh() {
    setState(() {
      _future = AdminService.getAllChatSessions();
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<AdminChatSession>>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          final message = snapshot.error is ApiException
              ? (snapshot.error as ApiException).message
              : 'Could not load chats';
          return Center(child: Text(message));
        }
        final sessions = snapshot.data ?? [];
        if (sessions.isEmpty) {
          return const Center(child: Text('No conversations yet'));
        }
        return RefreshIndicator(
          onRefresh: () async => _refresh(),
          child: ListView.builder(
            itemCount: sessions.length,
            itemBuilder: (context, index) {
              final session = sessions[index];
              return ListTile(
                leading: const Icon(Icons.chat_bubble_outline),
                title: Text(session.taskTitle ?? 'Task #${session.taskId}'),
                subtitle: Text(
                  '${session.customerName ?? 'Customer'} ↔ ${session.writerName ?? 'Writer'} · ${session.messageCount} messages',
                ),
                onTap: () => Navigator.of(context).push(MaterialPageRoute(
                  builder: (_) => ChatScreen(
                    sessionId: session.id,
                    viewerRole: 'ADMIN',
                    readOnly: true,
                    title: session.taskTitle ?? 'Chat',
                  ),
                )),
              );
            },
          ),
        );
      },
    );
  }
}
