export function formatTime(time) {
  if (time >= 60) {
    const minutes = Math.floor(time / 60);

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const formattedMinutes = formatBaseNumber(minutes % (hours * 60));
      const seconds = time % (60 * minutes);

      return `${hours}h:${formattedMinutes}m:${formatBaseNumber(seconds)}s`;
    } else {
      const seconds = time % (60 * minutes);

      return `${minutes}m:${formatBaseNumber(seconds)}s`;
    }
  } else if (time < 10) {
    return formatBaseNumber(time);
  }

  return time.toString();
}

export function formatBaseNumber(num) {
  if (num < 10) {
    return `0${num}`;
  }

  return num.toString();
}
