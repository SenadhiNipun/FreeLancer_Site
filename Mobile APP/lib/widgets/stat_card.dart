import 'package:flutter/material.dart';

/// Compact metric tile used on dashboard "Overview" tabs — a colored icon
/// accent, a value that counts up into place, a label, and an optional
/// secondary badge (e.g. "3 pending").
///
/// [value] is numeric so it can be animated; pass [valueFormatter] to
/// render it as currency, a rounded count, etc. Pass [accentColor] to give
/// each tile in a grid its own identity color (see `AppPalette.categorical`
/// in theme/app_theme.dart) — omit it to fall back to the theme's primary.
class StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final num value;
  final String Function(double animatedValue)? valueFormatter;
  final String? badge;
  final Color? accentColor;

  const StatCard({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    this.valueFormatter,
    this.badge,
    this.accentColor,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final accent = accentColor ?? colorScheme.primary;
    // Blend the accent toward the surface color rather than hardcoding a
    // tint, so the chip background stays readable in both light and dark
    // theme automatically.
    final chipBackground = Color.lerp(accent, colorScheme.surface, 0.78)!;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colorScheme.outlineVariant),
        boxShadow: [
          BoxShadow(
            color: accent.withValues(alpha: 0.16),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: chipBackground,
              borderRadius: BorderRadius.circular(9),
            ),
            child: Icon(icon, size: 17, color: accent),
          ),
          const SizedBox(height: 10),
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: value.toDouble()),
            duration: const Duration(milliseconds: 800),
            curve: Curves.easeOutCubic,
            builder: (context, animatedValue, _) {
              final display = valueFormatter != null
                  ? valueFormatter!(animatedValue)
                  : animatedValue.round().toString();
              return Text(
                display,
                style: textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
              );
            },
          ),
          Text(label, style: textTheme.bodySmall?.copyWith(color: colorScheme.onSurfaceVariant)),
          if (badge != null) ...[
            const SizedBox(height: 2),
            Text(
              badge!,
              style: textTheme.labelSmall?.copyWith(
                color: accent,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
