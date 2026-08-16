import 'package:flutter/material.dart';

/// Small inline empty-state block for a dashboard list section — an icon
/// and a muted message in a soft outlined panel, instead of a bare line of
/// text sitting in whitespace.
class EmptyStateHint extends StatelessWidget {
  final IconData icon;
  final String message;

  const EmptyStateHint({super.key, required this.icon, required this.message});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 20),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colorScheme.outlineVariant),
      ),
      child: Column(
        children: [
          Icon(icon, size: 26, color: colorScheme.onSurfaceVariant),
          const SizedBox(height: 8),
          Text(
            message,
            style: Theme.of(context)
                .textTheme
                .bodySmall
                ?.copyWith(color: colorScheme.onSurfaceVariant),
          ),
        ],
      ),
    );
  }
}
