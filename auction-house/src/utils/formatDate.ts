export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeLeft(dateStr: string) {
  const now = Date.now();
  const end = new Date(dateStr).getTime();
  const diff = end - now;

  if (diff <= 0) {
    return "Ended";
  }

  const hours = Math.floor(diff / 3600000);

  if (hours < 1) {
    const minutes = Math.floor(diff / 60000);
    return minutes + "m left";
  }

  if (hours < 24) {
    return hours + "h left";
  }

  const days = Math.floor(hours / 24);
  return days + "d left";
}

export function isEnded(dateStr: string) {
  return new Date(dateStr).getTime() <= Date.now();
}
