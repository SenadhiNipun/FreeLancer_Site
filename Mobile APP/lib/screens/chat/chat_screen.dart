import 'dart:async';
import 'package:flutter/material.dart';
import '../../models/chat_models.dart';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import '../../services/chat_service.dart';
import '../../services/admin_service.dart';

/// Shared thread view for customer/writer task chat and admin oversight.
class ChatScreen extends StatefulWidget {
  final int sessionId;
  final String viewerRole; // 'CUSTOMER' | 'WRITER' | 'ADMIN'
  final bool readOnly;
  final String? title;

  const ChatScreen({
    super.key,
    required this.sessionId,
    required this.viewerRole,
    this.readOnly = false,
    this.title,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _textController = TextEditingController();
  final _scrollController = ScrollController();
  Timer? _pollTimer;
  int? _currentUserId;
  List<ChatMessage> _messages = [];
  bool _isLoading = true;
  bool _isSending = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    _currentUserId = await AuthService.getUserId();
    await _loadMessages(showSpinner: true);
    _pollTimer = Timer.periodic(
      const Duration(seconds: 5),
      (_) => _loadMessages(showSpinner: false),
    );
  }

  Future<void> _loadMessages({required bool showSpinner}) async {
    if (showSpinner) setState(() => _isLoading = true);
    try {
      final messages = widget.readOnly
          ? await AdminService.getChatMessages(widget.sessionId)
          : await ChatService.getMessages(widget.sessionId);
      if (!mounted) return;
      setState(() {
        _messages = messages;
        _errorMessage = null;
      });
      WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
    } on ApiException catch (e) {
      if (mounted) setState(() => _errorMessage = e.message);
    } catch (e) {
      if (mounted) setState(() => _errorMessage = 'Could not reach the server');
    } finally {
      if (mounted && showSpinner) setState(() => _isLoading = false);
    }
  }

  void _scrollToBottom() {
    if (!_scrollController.hasClients) return;
    _scrollController.animateTo(
      _scrollController.position.maxScrollExtent,
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeOut,
    );
  }

  Future<void> _sendText() async {
    final text = _textController.text.trim();
    if (text.isEmpty || _isSending) return;
    setState(() => _isSending = true);
    try {
      final sent = await ChatService.sendMessage(widget.sessionId, text);
      _textController.clear();
      setState(() => _messages = [..._messages, sent]);
      WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    } finally {
      if (mounted) setState(() => _isSending = false);
    }
  }

  Future<void> _proposeBidChange() async {
    final amountController = TextEditingController();
    final noteController = TextEditingController();
    final proposed = await showDialog<double>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Propose new bid'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'New amount (\$)'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: noteController,
              decoration: const InputDecoration(labelText: 'Note (optional)'),
              maxLines: 2,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              final amount = double.tryParse(amountController.text);
              Navigator.of(context).pop(amount);
            },
            child: const Text('Send'),
          ),
        ],
      ),
    );
    if (proposed == null || proposed <= 0) return;

    setState(() => _isSending = true);
    try {
      final sent = await ChatService.sendMessage(
        widget.sessionId,
        noteController.text.trim().isEmpty
            ? 'Proposed a new bid'
            : noteController.text.trim(),
        messageType: 'BID_CHANGE',
        proposedAmount: proposed,
      );
      setState(() => _messages = [..._messages, sent]);
      WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    } finally {
      if (mounted) setState(() => _isSending = false);
    }
  }

  Future<void> _respondToBidChange(ChatMessage message, String action) async {
    try {
      final updated = await ChatService.respondToBidChange(message.id, action);
      setState(() {
        _messages = [
          for (final m in _messages) if (m.id == updated.id) updated else m,
        ];
      });
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    }
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.title ?? 'Chat')),
      body: Column(
        children: [
          Expanded(child: _buildMessageList()),
          if (!widget.readOnly) _buildInputBar(),
        ],
      ),
    );
  }

  Widget _buildMessageList() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_errorMessage != null) {
      return Center(child: Text(_errorMessage!));
    }
    if (_messages.isEmpty) {
      return const Center(child: Text('No messages yet'));
    }
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(12),
      itemCount: _messages.length,
      itemBuilder: (context, index) => _buildMessageBubble(_messages[index]),
    );
  }

  Widget _buildMessageBubble(ChatMessage message) {
    final isMine = message.senderId == _currentUserId;
    final colorScheme = Theme.of(context).colorScheme;

    if (message.messageType == 'BID_CHANGE') {
      final canRespond = widget.viewerRole == 'CUSTOMER' &&
          message.bidChangeStatus == 'PENDING' &&
          !widget.readOnly;
      return Align(
        alignment: isMine ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 6),
          padding: const EdgeInsets.all(12),
          constraints: const BoxConstraints(maxWidth: 280),
          decoration: BoxDecoration(
            color: colorScheme.tertiaryContainer,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Proposed bid: \$${message.proposedAmount?.toStringAsFixed(2) ?? '-'}',
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
              if (message.messageText.isNotEmpty) ...[
                const SizedBox(height: 4),
                Text(message.messageText),
              ],
              const SizedBox(height: 6),
              Text(
                'Status: ${message.bidChangeStatus ?? 'PENDING'}',
                style: Theme.of(context).textTheme.labelSmall,
              ),
              if (canRespond) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    TextButton(
                      onPressed: () => _respondToBidChange(message, 'REJECT'),
                      child: const Text('Decline'),
                    ),
                    FilledButton(
                      onPressed: () => _respondToBidChange(message, 'ACCEPT'),
                      child: const Text('Accept'),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      );
    }

    return Align(
      alignment: isMine ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        constraints: const BoxConstraints(maxWidth: 280),
        decoration: BoxDecoration(
          color: isMine ? colorScheme.primary : colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (widget.readOnly && message.senderName != null)
              Text(
                message.senderName!,
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: isMine
                          ? colorScheme.onPrimary.withValues(alpha: 0.7)
                          : colorScheme.onSurfaceVariant,
                    ),
              ),
            Text(
              message.messageText,
              style: TextStyle(color: isMine ? colorScheme.onPrimary : colorScheme.onSurface),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputBar() {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Row(
          children: [
            if (widget.viewerRole == 'WRITER')
              IconButton(
                icon: const Icon(Icons.request_quote_outlined),
                tooltip: 'Propose new bid',
                onPressed: _isSending ? null : _proposeBidChange,
              ),
            Expanded(
              child: TextField(
                controller: _textController,
                decoration: const InputDecoration(
                  hintText: 'Message',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.all(Radius.circular(24)),
                  ),
                  contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                ),
                onSubmitted: (_) => _sendText(),
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              icon: const Icon(Icons.send),
              onPressed: _isSending ? null : _sendText,
            ),
          ],
        ),
      ),
    );
  }
}
