// Convert HH:mm → minutes
export const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// Convert minutes → HH:mm
export const minutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");

  const m = (minutes % 60).toString().padStart(2, "0");

  return `${h}:${m}`;
};

// Add minutes to time
export const addMinutes = (time: string, mins: number) => {
  return minutesToTime(timeToMinutes(time) + mins);
};