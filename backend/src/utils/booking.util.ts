

export const addMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(h, m + minutes);

  return date.toTimeString().slice(0, 5);
};
