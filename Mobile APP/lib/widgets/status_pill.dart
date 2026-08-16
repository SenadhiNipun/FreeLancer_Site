import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Maps a raw backend status string (e.g. `PENDING_PAYMENT`, `ACCEPTED`) to
/// a semantic color and a human-readable label. Covers every `task_status`
/// and `bid_status` value the backend emits (see backend/app/entity).
class StatusStyle {
  final Color color;
  final String label;

  const StatusStyle(this.color, this.label);

  factory StatusStyle.of(BuildContext context, String status) {
    final colorScheme = Theme.of(context).colorScheme;
    switch (status) {
      case 'OPEN':
        return StatusStyle(colorScheme.primary, 'Open for bids');
      case 'PENDING_PAYMENT':
        return const StatusStyle(AppColors.warning, 'Pending payment');
      case 'PENDING_ASSIGNMENT':
        return const StatusStyle(AppColors.warning, 'Pending assignment');
      case 'ASSIGNED':
        return StatusStyle(colorScheme.tertiary, 'Assigned');
      case 'IN_PROGRESS':
        return StatusStyle(colorScheme.tertiary, 'In progress');
      case 'REVISION_REQUESTED':
        return const StatusStyle(AppColors.warning, 'Revision requested');
      case 'SUBMITTED':
        return StatusStyle(colorScheme.primary, 'Submitted');
      case 'COMPLETED':
        return const StatusStyle(AppColors.success, 'Completed');
      case 'CANCELLED':
        return StatusStyle(colorScheme.error, 'Cancelled');
      case 'PENDING':
        return const StatusStyle(AppColors.warning, 'Pending review');
      case 'ACCEPTED':
        return const StatusStyle(AppColors.success, 'Accepted');
      case 'WITHDRAWN':
        return StatusStyle(colorScheme.error, 'Withdrawn');
      default:
        return StatusStyle(colorScheme.onSurfaceVariant, status);
    }
  }
}

/// Small colored pill — a dot + label — used to show a task/bid status
/// without relying on color alone (the label is always present).
class StatusPillBadge extends StatelessWidget {
  final String status;

  const StatusPillBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    final style = StatusStyle.of(context, status);
    final colorScheme = Theme.of(context).colorScheme;
    final background = Color.lerp(style.color, colorScheme.surface, 0.82)!;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(8)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(color: style.color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 6),
          Text(
            style.label,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: style.color,
                  fontWeight: FontWeight.w600,
                ),
          ),
        ],
      ),
    );
  }
}
