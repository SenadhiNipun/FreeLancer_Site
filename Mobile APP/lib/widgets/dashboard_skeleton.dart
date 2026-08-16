import 'package:flutter/material.dart';
import 'shimmer_loading.dart';

/// Skeleton placeholder for a dashboard "Overview" tab: a header banner, a
/// stat-tile grid, and one or more list sections — shown via
/// [ShimmerLoading] instead of a bare spinner while real data loads.
class DashboardSkeleton extends StatelessWidget {
  final int gridItemCount;
  final List<int> sectionRowCounts;

  const DashboardSkeleton({
    super.key,
    this.gridItemCount = 5,
    this.sectionRowCounts = const [3],
  });

  @override
  Widget build(BuildContext context) {
    return ShimmerLoading(
      child: ListView(
        padding: const EdgeInsets.all(16),
        physics: const NeverScrollableScrollPhysics(),
        children: [
          const SkeletonBox(
            width: double.infinity,
            height: 96,
            borderRadius: BorderRadius.all(Radius.circular(20)),
          ),
          const SizedBox(height: 24),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.25,
            children: List.generate(gridItemCount, (_) => const _StatCardSkeleton()),
          ),
          for (final rowCount in sectionRowCounts) ...[
            const SizedBox(height: 24),
            const SkeletonBox(width: 140, height: 18),
            const SizedBox(height: 10),
            for (var i = 0; i < rowCount; i++) const _ListRowSkeleton(),
          ],
        ],
      ),
    );
  }
}

class _StatCardSkeleton extends StatelessWidget {
  const _StatCardSkeleton();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).colorScheme.outlineVariant),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SkeletonBox(width: 32, height: 32, borderRadius: BorderRadius.all(Radius.circular(9))),
          SizedBox(height: 10),
          SkeletonBox(width: 48, height: 22),
          SizedBox(height: 6),
          SkeletonBox(width: 72, height: 12),
        ],
      ),
    );
  }
}

class _ListRowSkeleton extends StatelessWidget {
  const _ListRowSkeleton();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Theme.of(context).colorScheme.outlineVariant),
        ),
        child: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SkeletonBox(width: double.infinity, height: 14),
            SizedBox(height: 8),
            SkeletonBox(width: 100, height: 11),
          ],
        ),
      ),
    );
  }
}
