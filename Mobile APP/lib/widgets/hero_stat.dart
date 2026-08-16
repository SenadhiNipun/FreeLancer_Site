import 'package:flutter/material.dart';

/// The one glanceable "hero" number shown inside a [GradientHeader]'s
/// frosted glass panel — an icon, a count-up animated value, and a label,
/// styled for a translucent surface (onPrimary text) rather than a card.
class HeroStat extends StatelessWidget {
  final IconData icon;
  final String label;
  final num value;
  final String Function(double animatedValue)? valueFormatter;

  const HeroStat({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    this.valueFormatter,
  });

  @override
  Widget build(BuildContext context) {
    final onPrimary = Theme.of(context).colorScheme.onPrimary;
    final textTheme = Theme.of(context).textTheme;

    return Row(
      children: [
        Icon(icon, color: onPrimary, size: 22),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: value.toDouble()),
                duration: const Duration(milliseconds: 900),
                curve: Curves.easeOutCubic,
                builder: (context, animatedValue, _) {
                  final display = valueFormatter != null
                      ? valueFormatter!(animatedValue)
                      : animatedValue.round().toString();
                  return Text(
                    display,
                    style: textTheme.headlineMedium?.copyWith(
                      color: onPrimary,
                      fontWeight: FontWeight.w700,
                    ),
                  );
                },
              ),
              Text(
                label,
                style: textTheme.bodySmall?.copyWith(color: onPrimary.withValues(alpha: 0.85)),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
