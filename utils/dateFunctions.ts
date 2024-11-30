export function getWeekRanges(
  targetDate: Date,
  numWeeks: number
): Array<{ start: Date; end: Date }> {
  if (numWeeks < 1 || numWeeks > 8) {
    throw new Error('Number of weeks must be between 1 and 8');
  }

  const ranges = [];
  const firstDay = new Date(targetDate);
  firstDay.setUTCHours(0, 0, 0, 0);

  const dayOfWeek = firstDay.getUTCDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  firstDay.setUTCDate(firstDay.getUTCDate() + diff);

  for (let i = 0; i < numWeeks; i++) {
    const weekStart = new Date(firstDay);
    weekStart.setUTCDate(weekStart.getUTCDate() + i * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
    weekEnd.setUTCHours(23, 59, 59, 999);

    ranges.push({ start: weekStart, end: weekEnd });
  }

  return ranges;
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}
