import 'package:flutter/material.dart';
import '../../models/admin_models.dart';
import '../../services/admin_service.dart';
import '../../services/api_client.dart';
import 'admin_task_list_screen.dart';

class AdminCustomerDetailScreen extends StatefulWidget {
  final AdminUser customer;

  const AdminCustomerDetailScreen({super.key, required this.customer});

  @override
  State<AdminCustomerDetailScreen> createState() => _AdminCustomerDetailScreenState();
}

class _AdminCustomerDetailScreenState extends State<AdminCustomerDetailScreen> {
  late AdminUser _customer;
  bool _isActing = false;

  @override
  void initState() {
    super.initState();
    _customer = widget.customer;
  }

  Future<void> _toggleStatus() async {
    setState(() => _isActing = true);
    final isSuspended = _customer.status == 'SUSPENDED';
    try {
      if (isSuspended) {
        await AdminService.activateUser(_customer.id);
      } else {
        await AdminService.suspendUser(_customer.id);
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(isSuspended ? 'Customer activated' : 'Customer suspended')),
        );
        Navigator.of(context).pop(true);
      }
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
      }
    } finally {
      if (mounted) setState(() => _isActing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isSuspended = _customer.status == 'SUSPENDED';
    return Scaffold(
      appBar: AppBar(title: Text(_customer.fullName)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(_customer.email, style: Theme.of(context).textTheme.bodyMedium),
          const SizedBox(height: 8),
          Chip(label: Text(_customer.status)),
          const SizedBox(height: 16),
          Text('Tasks posted: ${_customer.taskCount}'),
          const Divider(height: 32),
          OutlinedButton.icon(
            icon: const Icon(Icons.list_alt),
            label: const Text('View Tasks'),
            onPressed: () => Navigator.of(context).push(MaterialPageRoute(
              builder: (_) => AdminTaskListScreen(
                title: '${_customer.fullName}\'s tasks',
                loader: () => AdminService.getCustomerTasks(_customer.id),
              ),
            )),
          ),
          const SizedBox(height: 16),
          FilledButton.tonal(
            onPressed: _isActing ? null : _toggleStatus,
            child: Text(isSuspended ? 'Activate' : 'Suspend'),
          ),
        ],
      ),
    );
  }
}
