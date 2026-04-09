import { Availability } from "../availability/availability.model";
import { Appointment } from "../appointments/appointment.model";
import { timeToMinutes, minutesToTime } from "@/utils/time.util";

// ===============================
// TYPES
// ===============================
type Slot = {
  startTime: string;
  endTime: string;
};

type GenerateSlotsParams = {
  staffId: string;
  date: string;
  duration: number; // minutes
};

export const generateTimeSlots = async ({
  staffId,
  date,
  duration,
}: GenerateSlotsParams): Promise<Slot[]> => {
  // ===============================
  // GET DAY NAME
  // ===============================
  const day = new Date(date)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  // ===============================
  // GET AVAILABILITY
  // ===============================
  const availability = await Availability.findOne({
    staff: staffId,
    day,
  });

  if (!availability || !availability.startTime || !availability.endTime) {
    return [];
  }

  const start = timeToMinutes(availability.startTime);
  const end = timeToMinutes(availability.endTime);

  // ===============================
  // GET BOOKINGS
  // ===============================
  const bookings = await Appointment.find({
    staff: staffId,
    date: new Date(date),
    status: { $ne: "cancelled" },
  });

  const bookedSlots = bookings
    .filter((b) => b.startTime && b.endTime)
    .map((b) => ({
      start: timeToMinutes(b.startTime as string),
      end: timeToMinutes(b.endTime as string),
    }));

  // ===============================
  // GENERATE SLOTS
  // ===============================
  const slots: Slot[] = [];

  for (let time = start; time + duration <= end; time += duration) {
    const slotStart = time;
    const slotEnd = time + duration;

    // ===============================
    // CHECK OVERLAP
    // ===============================
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