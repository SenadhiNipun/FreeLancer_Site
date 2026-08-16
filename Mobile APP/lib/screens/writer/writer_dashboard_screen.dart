import 'package:flutter/material.dart';
import '../../models/bid.dart';
import '../../models/task.dart';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import '../../services/writer_service.dart';
import '../../theme/app_theme.dart';
import '../../util/greeting.dart';
import '../../widgets/dashboard_list_tile.dart';
import '../../widgets/dashboard_skeleton.dart';
import '../../widgets/empty_state_hint.dart';
import '../../widgets/fade_slide_in.dart';
import '../../widgets/gradient_header.dart';
import '../../widgets/hero_stat.dart';
import '../../widgets/pressable.dart';
import '../../widgets/stat_card.dart';
import '../login_screen.dart';
import 'writer_active_tasks_tab.dart';
import 'writer_available_tasks_tab.dart';
import 'writer_chats_tab.dart';
import 'writer_completed_tasks_tab.dart';
import 'writer_task_detail_screen.dart';

class WriterDashboardScreen extends StatefulWidget {
  const WriterDashboardScreen({super.key});

  @override
  State<WriterDashboardScreen> createState() => _WriterDashboardScreenState();
}

class _WriterDashboardScreenState extends State<WriterDashboardScreen> {
  int _tabIndex = 0;

  late final List<Widget> _tabs = [
    _WriterOverviewTab(onNavigate: _goToTab),
    const WriterAvailableTasksTab(),
    const WriterActiveTasksTab(),
    const WriterCompletedTasksTab(),
    const WriterChatsTab(),
  ];

  void _goToTab(int index) => setState(() => _tabIndex = index);

  Future<void> _logout() async {
    await AuthService.logout();
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    const titles = ['Dashboard', 'Available', 'Active', 'Completed', 'Chats'];
    return Scaffold(
      appBar: AppBar(
        title: Text(titles[_tabIndex]),
        actions: [
          IconButton(icon: const Icon(Icons.logout), onPressed: _logout),
        ],
      ),
      body: IndexedStack(index: _tabIndex, children: _tabs),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tabIndex,
        onDestinationSelected: (i) => setState(() => _tabIndex = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.explore_outlined), label: 'Available'),
          NavigationDestination(icon: Icon(Icons.work_outline), label: 'Active'),
          NavigationDestination(icon: Icon(Icons.check_circle_outline), label: 'Done'),
          NavigationDestination(icon: Icon(Icons.chat_bubble_outline), label: 'Chats'),
        ],
      ),
    );
  }
}

class _WriterOverviewTab extends StatefulWidget {
  final ValueChanged<int> onNavigate;

  const _WriterOverviewTab({required this.onNavigate});

  @override
  State<_WriterOverviewTab> createState() => _WriterOverviewTabState();
}

class _OverviewData {
  final List<Task> myTasks;
  final List<Bid> myBids;
  final List<Task> openTasks;

  _OverviewData(this.myTasks, this.myBids, this.openTasks);
}

class _WriterOverviewTabState extends State<_WriterOverviewTab> {
  late Future<_OverviewData> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<_OverviewData> _load() async {
    final results = await Future.wait([
      WriterService.getMyTasks(),
      WriterService.getMyBids(),
      WriterService.getOpenTasks(),
    ]);
    return _OverviewData(
      results[0] as List<Task>,
      results[1] as List<Bid>,
      results[2] as List<Task>,
    );
  }

  void _refresh() {
    setState(() {
      _future = _load();
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<_OverviewData>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const DashboardSkeleton(gridItemCount: 4, sectionRowCounts: [3, 3]);
        }
        if (snapshot.hasError) {
          final message = snapshot.error is ApiException
              ? (snapshot.error as ApiException).message
              : 'Could not load dashboard';
          return Center(child: Text(message));
        }
        final data = snapshot.data!;
        final active = data.myTasks
            .where((t) => t.taskStatus != 'COMPLETED' && t.taskStatus != 'CANCELLED')
            .toList();
        final completed = data.myTasks.where((t) => t.taskStatus == 'COMPLETED').toList();
        final pendingBids = data.myBids.where((b) => b.bidStatus == 'PENDING').toList();
        final totalEarned = completed.fold<double>(0, (sum, t) => sum + (t.budget ?? 0));
        final palette = AppPalette.categorical(context);

        return RefreshIndicator(
          onRefresh: () async => _refresh(),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              FadeSlideIn(
                child: GradientHeader(
                  title: timeOfDayGreeting(),
                  subtitle: active.isEmpty
                      ? "You're all caught up — browse available tasks to bid on more."
                      : 'You have ${active.length} active task${active.length == 1 ? '' : 's'} in progress.',
                  icon: Icons.edit_note,
                  heroStat: HeroStat(
                    icon: Icons.payments_outlined,
                    label: 'Total Earned',
                    value: totalEarned,
                    valueFormatter: (v) => '\$${v.toStringAsFixed(2)}',
                  ),
                ),
              ),
              const SizedBox(height: 20),
              // Bento layout: the hero number lives in the glass panel above,
              // this is the smaller supporting grid — each tile jumps to its
              // matching tab, since a dashboard number is a drill-down entry
              // point, not just a readout.
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
                        icon: Icons.work_outline,
                        label: 'Active Tasks',
                        value: active.length,
                        accentColor: palette[0],
                      ),
                    ),
                  ),
                  FadeSlideIn(
                    delay: const Duration(milliseconds: 120),
                    child: StatCard(
                      icon: Icons.hourglass_top_outlined,
                      label: 'Pending Bids',
                      value: pendingBids.length,
                      accentColor: palette[1],
                    ),
                  ),
                  FadeSlideIn(
                    delay: const Duration(milliseconds: 180),
                    child: Pressable(
                      onTap: () => widget.onNavigate(1),
                      child: StatCard(
                        icon: Icons.explore_outlined,
                        label: 'Available Now',
                        value: data.openTasks.length,
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
                        value: completed.length,
                        accentColor: palette[3],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              FadeSlideIn(
                delay: const Duration(milliseconds: 380),
                child: Row(
                  children: [
                    Expanded(
                      child: Text('Active tasks', style: Theme.of(context).textTheme.titleMedium),
                    ),
                    if (active.isNotEmpty)
                      TextButton(
                        onPressed: () => widget.onNavigate(2),
                        child: const Text('View all'),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 4),
              if (active.isEmpty)
                FadeSlideIn(
                  delay: const Duration(milliseconds: 380),
                  child: const EmptyStateHint(
                    icon: Icons.work_off_outlined,
                    message: 'No active tasks — browse available work to get started.',
                  ),
                )
              else
                for (final (i, task) in active.take(5).indexed)
                  FadeSlideIn(
                    delay: Duration(milliseconds: 400 + i * 40),
                    child: DashboardListTile(
                      title: task.title,
                      status: task.taskStatus,
                      meta: 'Due ${task.deadline.toLocal().toString().split(' ').first}'
                          '${task.customerName != null ? ' · ${task.customerName}' : ''}',
                      amount: task.budget,
                      onTap: () async {
                        await Navigator.of(context).push(MaterialPageRoute(
                          builder: (_) => WriterTaskDetailScreen(taskId: task.id),
                        ));
                        _refresh();
                      },
                    ),
                  ),
              const SizedBox(height: 16),
              FadeSlideIn(
                delay: const Duration(milliseconds: 460),
                child: Text('Your bids', style: Theme.of(context).textTheme.titleMedium),
              ),
              const SizedBox(height: 8),
              if (data.myBids.isEmpty)
                FadeSlideIn(
                  delay: const Duration(milliseconds: 460),
                  child: const EmptyStateHint(
                    icon: Icons.hourglass_empty,
                    message: 'No bids yet — place a bid on an available task.',
                  ),
                )
              else
                for (final (i, bid) in data.myBids.take(5).indexed)
                  FadeSlideIn(
                    delay: Duration(milliseconds: 480 + i * 40),
                    child: DashboardListTile(
                      title: bid.taskTitle ?? 'Task #${bid.taskId}',
                      status: bid.bidStatus,
                      amount: bid.bidAmount,
                      onTap: () async {
                        await Navigator.of(context).push(MaterialPageRoute(
                          builder: (_) => WriterTaskDetailScreen(taskId: bid.taskId),
                        ));
                        _refresh();
                      },
                    ),
                  ),
            ],
          ),
        );
      },
    );
  }
}
