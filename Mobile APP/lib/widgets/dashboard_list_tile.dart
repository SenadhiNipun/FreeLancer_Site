import 'package:flutter/material.dart';
import 'pressable.dart';
import 'status_pill.dart';

/// Modern row used for "Active tasks" / "Your bids" style summaries on a
/// dashboard — title, a status pill (color + label, never color alone),
/// optional meta line (due date, customer), and a trailing amount. Wrap in
/// [Pressable] semantics automatically when [onTap] is given.
class DashboardListTile extends StatelessWidget {
  final String title;
  final String status;
  final String? meta;
  final double? amount;
  final VoidCallback? onTap;

  const DashboardListTile({
    super.key,
    required this.title,
    required this.status,
    this.meta,
    this.amount,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Pressable(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: colorScheme.outlineVariant),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: textTheme.titleSmall,
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      StatusPillBadge(status: status),
                      if (meta != null) ...[
                        const SizedBox(width: 8),
                        Flexible(
                          child: Text(
                            meta!,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: textTheme.bodySmall
                                ?.copyWith(color: colorScheme.onSurfaceVariant),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
            if (amount != null) ...[
              const SizedBox(width: 12),
              Text(
                '\$${amount!.toStringAsFixed(2)}',
                style: textTheme.titleSmall?.copyWith(
                  color: colorScheme.primary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
            if (onTap != null) ...[
              const SizedBox(width: 4),
              Icon(Icons.chevron_right, size: 18, color: colorScheme.onSurfaceVariant),
            ],
          ],
        ),
      ),
    );
  }
}
