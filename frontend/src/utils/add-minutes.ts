const addMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + minutes);

  return date.toTimeString().slice(0, 5);
};

export default addMinutes;
