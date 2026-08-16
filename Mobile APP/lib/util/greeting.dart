/// Time-of-day greeting ("Good morning" / "Good afternoon" / "Good
/// evening") — used on dashboard headers to feel personal without needing
/// a name from the backend.
String timeOfDayGreeting([DateTime? now]) {
  final hour = (now ?? DateTime.now()).hour;
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
