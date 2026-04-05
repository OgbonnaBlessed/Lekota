import { Availability } from "../availability/availability.model";
import { Appointment } from "../appointments/appointment.model";
import { timeToMinutes, minutesToTime } from "@/utils/time.util";

export const generateTimeSlots = async ({
  staffId,
  date,
  duration, // total minutes (service + buffer)
}: {
  staffId: string;
  date: string;
  duration: number;
}) => {
  const day = new Date(date)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  // 1️⃣ Get staff availability for that day
  const availability = await Availability.findOne({
    staff: staffId,
    day,
  });

  if (!availability) return [];

  if (!availability.startTime || !availability.endTime) return [];

  const start = timeToMinutes(availability.startTime);
  const end = timeToMinutes(availability.endTime);

  // 2️⃣ Get existing bookings for that day
  const bookings = await Appointment.find({
    staff: staffId,
    date: new Date(date),
    status: { $ne: "cancelled" },
  });

  const bookedSlots = bookings
    .filter((b) => b.startTime && b.endTime)
    .map((b) => ({
      start: timeToMinutes(b.startTime!),
      end: timeToMinutes(b.endTime!),
    }));

  // 3️⃣ Generate slots
  const slots = [];

  for (let time = start; time + duration <= end; time += duration) {
    const slotStart = time;
    const slotEnd = time + duration;

    // 4️⃣ Check overlap
    const isBooked = bookedSlots.some(
      (b) =>
        (slotStart >= b.start && slotStart < b.end) ||
        (slotEnd > b.start && slotEnd <= b.end) ||
        (slotStart <= b.start && slotEnd >= b.end),
    );

    if (!isBooked) {
      slots.push({
        startTime: minutesToTime(slotStart),
        endTime: minutesToTime(slotEnd),
      });
    }
  }

  return slots;
};
