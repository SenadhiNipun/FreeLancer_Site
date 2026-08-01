import 'package:flutter/material.dart';
import '../screens/admin/admin_dashboard_screen.dart';
import '../screens/tasks_screen.dart';
import '../screens/writer/writer_dashboard_screen.dart';

class RoleRouter {
  static Widget dashboardFor(List<String> roles) {
    if (roles.contains('SUPER_ADMIN') || roles.contains('ADMIN')) {
      return const AdminDashboardScreen();
    }
    if (roles.contains('WRITER')) {
      return const WriterDashboardScreen();
    }
    return const TasksScreen();
  }
}
