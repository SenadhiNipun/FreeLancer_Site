import 'package:flutter/material.dart';
import '../../models/bid.dart';
import '../../models/task.dart';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import '../../services/writer_service.dart';
import '../../widgets/stat_card.dart';
import '../login_screen.dart';
import 'writer_active_tasks_tab.dart';
import 'writer_available_tasks_tab.dart';
import 'writer_chats_tab.dart';
import 'writer_completed_tasks_tab.dart';

class WriterDashboardScreen extends StatefulWidget {
  const WriterDashboardScreen({super.key});

  @override
  State<WriterDashboardScreen> createState() => _WriterDashboardScreenState();
}

class _WriterDashboardScreenState extends State<WriterDashboardScreen> {
  int _tabIndex = 0;

  late final List<Widget> _tabs = [
    const _WriterOverviewTab(),
    const WriterAvailableTasksTab(),
    const WriterActiveTasksTab(),
    const WriterCompletedTasksTab(),
    const WriterChatsTab(),
  ];

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
  const _WriterOverviewTab();

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
          return const Center(child: CircularProgressIndicator());
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
                childAspectRatio: 1.5,
                children: [
                  StatCard(
                    icon: Icons.work_outline,
                    label: 'Active Tasks',
                    value: '${active.length}',
                  ),
                  StatCard(
                    icon: Icons.hourglass_top_outlined,
                    label: 'Pending Bids',
                    value: '${pendingBids.length}',
                  ),
                  StatCard(
                    icon: Icons.explore_outlined,
                    label: 'Available Now',
                    value: '${data.openTasks.length}',
                  ),
                  StatCard(
                    icon: Icons.check_circle_outline,
                    label: 'Completed',
                    value: '${completed.length}',
                  ),
                  StatCard(
                    icon: Icons.payments_outlined,
                    label: 'Total Earned',
                    value: '\$${totalEarned.toStringAsFixed(2)}',
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Text('Active tasks', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              if (active.isEmpty) const Text('No active tasks'),
              for (final task in active.take(5))
                Card(
                  child: ListTile(
                    title: Text(task.title),
                    subtitle: Text(task.taskStatus),
                    trailing: task.budget != null
                        ? Text('\$${task.budget!.toStringAsFixed(2)}')
                        : null,
                  ),
                ),
              const SizedBox(height: 16),
              Text('Your bids', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              if (data.myBids.isEmpty) const Text('No bids yet'),
              for (final bid in data.myBids.take(5))
                Card(
                  child: ListTile(
                    title: Text(bid.taskTitle ?? 'Task #${bid.taskId}'),
                    subtitle: Text(bid.bidStatus),
                    trailing: Text('\$${bid.bidAmount.toStringAsFixed(2)}'),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}
