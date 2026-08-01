import 'package:flutter/material.dart';
import '../../models/admin_models.dart';
import '../../services/admin_service.dart';
import '../../services/api_client.dart';
import '../../theme/app_theme.dart';
import 'admin_writer_detail_screen.dart';

class AdminOverviewTab extends StatefulWidget {
  const AdminOverviewTab({super.key});

  @override
  State<AdminOverviewTab> createState() => _AdminOverviewTabState();
}

class _OverviewData {
  final PlatformStats stats;
  final List<AdminUser> pendingWriters;

  _OverviewData(this.stats, this.pendingWriters);
}

class _AdminOverviewTabState extends State<AdminOverviewTab> {
  late Future<_OverviewData> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_OverviewData> _load() async {
    final results = await Future.wait([
      AdminService.getStats(),
      AdminService.getPendingWriters(),
    ]);
    return _OverviewData(results[0] as PlatformStats, results[1] as List<AdminUser>);
  }

  void _refresh() {
    setState(() {
      _future = _load();
    });
  }

  Future<void> _quickAction(Future<void> Function() action) async {
    try {
      await action();
      _refresh();
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<_OverviewData>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          final message = snapshot.error is ApiException
              ? (snapshot.error as ApiException).message
              : 'Could not load dashboard';
          return Center(child: Text(message));
        }
        final data = snapshot.data!;
        final stats = data.stats;
        final pending = data.pendingWriters.take(5).toList();

        return RefreshIndicator(
          onRefresh: () async => _refresh(),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.6,
                children: [
                  _StatCard(
                    label: 'Customers',
                    value: '${stats.totalCustomers}',
                  ),
                  _StatCard(
                    label: 'Writers',
                    value: '${stats.totalWriters}',
                    badge: stats.pendingWriters > 0 ? '${stats.pendingWriters} pending' : null,
                  ),
                  _StatCard(
                    label: 'Total Tasks',
                    value: '${stats.totalTasks}',
                    badge: '${stats.activeTasks} active',
                  ),
                  _StatCard(
                    label: 'Completed',
                    value: '${stats.completedTasks}',
                  ),
                  _StatCard(
                    label: 'Revenue',
                    value: '\$${stats.totalRevenue.toStringAsFixed(2)}',
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Text('Pending Approvals', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              if (pending.isEmpty) const Text('No writers waiting for approval'),
              for (final writer in pending)
                Card(
                  child: ListTile(
                    title: Text(writer.fullName),
                    subtitle: Text(writer.email),
                    onTap: () => Navigator.of(context).push(MaterialPageRoute(
                      builder: (_) => AdminWriterDetailScreen(writer: writer),
                    )),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: Icon(Icons.close, color: Theme.of(context).colorScheme.error),
                          onPressed: () => _quickAction(
                            () => AdminService.rejectWriter(writer.id),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.check, color: AppColors.success),
                          onPressed: () => _quickAction(
                            () => AdminService.approveWriter(writer.id),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final String? badge;

  const _StatCard({required this.label, required this.value, this.badge});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            value,
            style: Theme.of(context)
                .textTheme
                .headlineSmall
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          Text(label, style: Theme.of(context).textTheme.bodySmall),
          if (badge != null)
            Text(
              badge!,
              style: Theme.of(context)
                  .textTheme
                  .labelSmall
                  ?.copyWith(color: colorScheme.primary),
            ),
        ],
      ),
    );
  }
}
