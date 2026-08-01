import 'package:flutter/material.dart';
import '../../models/admin_models.dart';
import '../../services/admin_service.dart';
import '../../services/api_client.dart';
import 'admin_writer_detail_screen.dart';

const _filters = ['All', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'INCOMPLETE'];

class AdminWritersTab extends StatefulWidget {
  const AdminWritersTab({super.key});

  @override
  State<AdminWritersTab> createState() => _AdminWritersTabState();
}

class _AdminWritersTabState extends State<AdminWritersTab> {
  late Future<List<AdminUser>> _future;
  String _filter = 'All';
  String _query = '';

  @override
  void initState() {
    super.initState();
    _future = AdminService.getAllWriters();
  }

  void _refresh() {
    setState(() {
      _future = AdminService.getAllWriters();
    });
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
              hintText: 'Search by name or email',
              isDense: true,
            ),
            onChanged: (v) => setState(() => _query = v.toLowerCase()),
          ),
        ),
        SizedBox(
          height: 40,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            children: [
              for (final filter in _filters)
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(filter == 'PENDING_APPROVAL' ? 'PENDING' : filter),
                    selected: _filter == filter,
                    onSelected: (_) => setState(() => _filter = filter),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: FutureBuilder<List<AdminUser>>(
            future: _future,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }
              if (snapshot.hasError) {
                final message = snapshot.error is ApiException
                    ? (snapshot.error as ApiException).message
                    : 'Could not load writers';
                return Center(child: Text(message));
              }
              var writers = snapshot.data ?? [];
              if (_filter != 'All') {
                writers = writers.where((w) => w.profileStatusBucket == _filter).toList();
              }
              if (_query.isNotEmpty) {
                writers = writers
                    .where((w) =>
                        w.fullName.toLowerCase().contains(_query) ||
                        w.email.toLowerCase().contains(_query))
                    .toList();
              }
              if (writers.isEmpty) {
                return const Center(child: Text('No writers found'));
              }
              return RefreshIndicator(
                onRefresh: () async => _refresh(),
                child: ListView.builder(
                  itemCount: writers.length,
                  itemBuilder: (context, index) {
                    final writer = writers[index];
                    return ListTile(
                      leading: CircleAvatar(
                        child: Text(
                          writer.firstName.isNotEmpty
                              ? writer.firstName[0].toUpperCase()
                              : '?',
                        ),
                      ),
                      title: Text(writer.fullName),
                      subtitle: Text(
                        '${writer.email} · ${writer.profileStatusBucket} · ${writer.taskCount} tasks',
                      ),
                      trailing: writer.status == 'SUSPENDED'
                          ? Icon(Icons.block, color: Theme.of(context).colorScheme.error)
                          : null,
                      onTap: () async {
                        final changed = await Navigator.of(context).push<bool>(
                          MaterialPageRoute(
                            builder: (_) => AdminWriterDetailScreen(writer: writer),
                          ),
                        );
                        if (changed == true) _refresh();
                      },
                    );
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
