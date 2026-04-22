type SeriesPoint = { label: string; messages: number; dau: number }
function formatLabel(date: Date, granularity: "day" | "week" | "month") {
  const opts: Intl.DateTimeFormatOptions =
    granularity === "day"
      ? { month: "short", day: "numeric" }
      : granularity === "week"
        ? { month: "short", day: "numeric" }
        : { month: "short", year: "2-digit" }
  return date.toLocaleDateString("en-US", opts)
}
export function generateTimeSeries({
  days = 30,
  granularity = "day",
}: {
  days?: number
  granularity?: "day" | "week" | "month"
}): SeriesPoint[] {
  const now = new Date()
  const data: SeriesPoint[] = []

  const step = granularity === "day" ? 1 : granularity === "week" ? 7 : 30 // approximate months as 30 days

  for (let i = days; i >= 0; i -= step) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const messages = Math.max(20000, Math.floor(20000 + Math.sin(i / 5) * 6000 + Math.random() * 4000))
    const dau = Math.max(1500, Math.floor(1500 + Math.cos(i / 7) * 400 + Math.random() * 250))
    data.push({ label: formatLabel(d, granularity), messages, dau })
  }
  return data
}