import 'package:flutter/material.dart';
import '../../models/admin_models.dart';
import '../../services/admin_service.dart';
import '../../services/api_client.dart';
import 'admin_customer_detail_screen.dart';

const _filters = ['All', 'ACTIVE', 'SUSPENDED'];

class AdminCustomersTab extends StatefulWidget {
  const AdminCustomersTab({super.key});

  @override
  State<AdminCustomersTab> createState() => _AdminCustomersTabState();
}

class _AdminCustomersTabState extends State<AdminCustomersTab> {
  late Future<List<AdminUser>> _future;
  String _filter = 'All';
  String _query = '';

  @override
  void initState() {
    super.initState();
    _future = AdminService.getAllCustomers();
  }

  void _refresh() {
    setState(() {
      _future = AdminService.getAllCustomers();
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
                    label: Text(filter),
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
                    : 'Could not load customers';
                return Center(child: Text(message));
              }
              var customers = snapshot.data ?? [];
              if (_filter != 'All') {
                customers = customers.where((c) => c.status == _filter).toList();
              }
              if (_query.isNotEmpty) {
                customers = customers
                    .where((c) =>
                        c.fullName.toLowerCase().contains(_query) ||
                        c.email.toLowerCase().contains(_query))
                    .toList();
              }
              if (customers.isEmpty) {
                return const Center(child: Text('No customers found'));
              }
              return RefreshIndicator(
                onRefresh: () async => _refresh(),
                child: ListView.builder(
                  itemCount: customers.length,
                  itemBuilder: (context, index) {
                    final customer = customers[index];
                    return ListTile(
                      leading: CircleAvatar(
                        child: Text(
                          customer.firstName.isNotEmpty
                              ? customer.firstName[0].toUpperCase()
                              : '?',
                        ),
                      ),
                      title: Text(customer.fullName),
                      subtitle: Text('${customer.email} · ${customer.taskCount} tasks'),
                      trailing: customer.status == 'SUSPENDED'
                          ? Icon(Icons.block, color: Theme.of(context).colorScheme.error)
                          : null,
                      onTap: () async {
                        final changed = await Navigator.of(context).push<bool>(
                          MaterialPageRoute(
                            builder: (_) => AdminCustomerDetailScreen(customer: customer),
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
