export interface TimeLeft {
  expired: boolean;
  label: string;
  urgent?: boolean;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeLeft(endsAt: string): TimeLeft {
  const now = Date.now();
  const end = new Date(endsAt).getTime();
  const diff = end - now;

  if (diff <= 0) return { expired: true, label: "Ended" };

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);

  if (days > 0) return { expired: false, label: `${days}d ${hours}h` };
  if (hours > 0)
    return { expired: false, label: `${hours}h ${minutes}m`, urgent: hours < 2 };
  return { expired: false, label: `${minutes}m ${seconds}s`, urgent: true };
}

export function startCountdown(
  el: HTMLElement,
  endsAt: string,
  onExpire?: () => void
): ReturnType<typeof setInterval> {
  function update(): void {
    const { expired, label, urgent } = timeLeft(endsAt);
    el.textContent = expired ? "Ended" : label;
    el.className = el.className.replace(/\btext-(green|yellow|red)-\d+\b/g, "");

    if (expired) {
      el.classList.add("text-gray-400");
      if (onExpire) onExpire();
      return;
    }
    el.classList.add(urgent ? "text-red-500" : "text-green-600");
  }

  update();
  return setInterval(update, 1_000);
}
