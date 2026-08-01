import 'package:flutter/material.dart';

/// Compact metric tile used on dashboard "Overview" tabs — an icon accent,
/// a bold value, a label, and an optional secondary badge (e.g. "3 pending").
class StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final String? badge;

  const StatCard({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    this.badge,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colorScheme.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(9),
            ),
            child: Icon(icon, size: 17, color: colorScheme.onPrimaryContainer),
          ),
          const Spacer(),
          Text(
            value,
            style: textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
          ),
          Text(label, style: textTheme.bodySmall?.copyWith(color: colorScheme.onSurfaceVariant)),
          if (badge != null) ...[
            const SizedBox(height: 2),
            Text(
              badge!,
              style: textTheme.labelSmall?.copyWith(
                color: colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
