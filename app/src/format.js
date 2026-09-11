const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** "Today, 2:45 PM" / "Yesterday, 2:45 PM" / "Tue, Sep 9, 2:45 PM" */
export function formatWhen(date, now = new Date()) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(d, now)) return `Today, ${timeFmt.format(d)}`;
  if (isSameDay(d, yesterday)) return `Yesterday, ${timeFmt.format(d)}`;
  return `${dayFmt.format(d)}, ${timeFmt.format(d)}`;
}

export function formatDay(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return dayFmt.format(d);
}

export function formatTime(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return timeFmt.format(d);
}

export function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

/** Rough "in 20 minutes" / "in 2 hours" style estimate, past tense collapses to "any moment now". */
export function formatEta(date, now = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const diffMin = Math.round((d.getTime() - now.getTime()) / 60000);
  if (diffMin <= 0) return "any moment now";
  if (diffMin < 60) return `in about ${diffMin} min`;
  const hours = Math.round(diffMin / 60);
  return `in about ${hours} hr${hours === 1 ? "" : "s"}`;
}
