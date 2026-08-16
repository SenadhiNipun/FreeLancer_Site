import 'package:flutter/material.dart';
import '../../models/admin_models.dart';
import '../../services/admin_service.dart';
import '../../services/api_client.dart';
import '../../theme/app_theme.dart';
import '../../util/greeting.dart';
import '../../widgets/dashboard_skeleton.dart';
import '../../widgets/fade_slide_in.dart';
import '../../widgets/gradient_header.dart';
import '../../widgets/hero_stat.dart';
import '../../widgets/pressable.dart';
import '../../widgets/stat_card.dart';
import 'admin_writer_detail_screen.dart';

class AdminOverviewTab extends StatefulWidget {
  final ValueChanged<int> onNavigate;

  const AdminOverviewTab({super.key, required this.onNavigate});

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
          return const DashboardSkeleton(gridItemCount: 4, sectionRowCounts: [3]);
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
        final palette = AppPalette.categorical(context);

        return RefreshIndicator(
          onRefresh: () async => _refresh(),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              FadeSlideIn(
                child: GradientHeader(
                  title: timeOfDayGreeting(),
                  subtitle: stats.pendingWriters > 0
                      ? '${stats.pendingWriters} writer${stats.pendingWriters == 1 ? '' : 's'} waiting for approval.'
                      : 'Platform is running smoothly — no approvals pending.',
                  icon: Icons.dashboard_customize,
                  heroStat: HeroStat(
                    icon: Icons.payments_outlined,
                    label: 'Revenue',
                    value: stats.totalRevenue,
                    valueFormatter: (v) => '\$${v.toStringAsFixed(2)}',
                  ),
                ),
              ),
              const SizedBox(height: 20),
              // Bento layout: Revenue is the hero number above, this is the
              // smaller supporting grid — each tile jumps to its matching
              // tab, since a dashboard number is a drill-down entry point.
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.25,
                children: [
                  FadeSlideIn(
                    delay: const Duration(milliseconds: 60),
                    child: Pressable(
                      onTap: () => widget.onNavigate(2),
                      child: StatCard(
                        icon: Icons.people_outline,
                        label: 'Customers',
                        value: stats.totalCustomers,
                        accentColor: palette[0],
                      ),
                    ),
                  ),
                  FadeSlideIn(
                    delay: const Duration(milliseconds: 120),
                    child: Pressable(
                      onTap: () => widget.onNavigate(1),
                      child: StatCard(
                        icon: Icons.edit_note,
                        label: 'Writers',
                        value: stats.totalWriters,
                        badge: stats.pendingWriters > 0 ? '${stats.pendingWriters} pending' : null,
                        accentColor: palette[1],
                      ),
                    ),
                  ),
                  FadeSlideIn(
                    delay: const Duration(milliseconds: 180),
                    child: Pressable(
                      onTap: () => widget.onNavigate(3),
                      child: StatCard(
                        icon: Icons.task_outlined,
                        label: 'Total Tasks',
                        value: stats.totalTasks,
                        badge: '${stats.activeTasks} active',
                        accentColor: palette[2],
                      ),
                    ),
                  ),
                  FadeSlideIn(
                    delay: const Duration(milliseconds: 240),
                    child: Pressable(
                      onTap: () => widget.onNavigate(3),
                      child: StatCard(
                        icon: Icons.check_circle_outline,
                        label: 'Completed',
                        value: stats.completedTasks,
                        accentColor: palette[3],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              FadeSlideIn(
                delay: const Duration(milliseconds: 380),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
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
              ),
            ],
          ),
        );
      },
    );
  }
}
