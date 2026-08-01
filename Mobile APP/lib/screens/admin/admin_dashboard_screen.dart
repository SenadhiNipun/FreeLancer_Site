import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import '../login_screen.dart';
import 'admin_chats_tab.dart';
import 'admin_customers_tab.dart';
import 'admin_overview_tab.dart';
import 'admin_tasks_tab.dart';
import 'admin_writers_tab.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  int _tabIndex = 0;

  late final List<Widget> _tabs = [
    const AdminOverviewTab(),
    const AdminWritersTab(),
    const AdminCustomersTab(),
    const AdminTasksTab(),
    const AdminChatsTab(),
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
    const titles = ['Overview', 'Writers', 'Customers', 'Tasks', 'Chats'];
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
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), label: 'Overview'),
          NavigationDestination(icon: Icon(Icons.edit_note), label: 'Writers'),
          NavigationDestination(icon: Icon(Icons.people_outline), label: 'Customers'),
          NavigationDestination(icon: Icon(Icons.task_outlined), label: 'Tasks'),
          NavigationDestination(icon: Icon(Icons.chat_bubble_outline), label: 'Chats'),
        ],
      ),
    );
  }
}
