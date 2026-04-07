import { Availability } from "../availability/availability.model";
import { Appointment } from "./appointment.model";
import { addMinutes } from "@/utils/booking.util";
import { sendNotification } from "../notifications/notification.service";

export const createAppointmentService = async ({
  staffId,
  clientId,
  date,
  startTime,
  duration,
  buffer,
  // service,
  // subService,
  reason,
}: any) => {
  // 🔹 1. Get day
  const day = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
  });

  // 🔹 2. Check availability
  const availability = await Availability.findOne({
    staff: staffId,
    day,
  });

  if (!availability || !availability.startTime || !availability.endTime) {
    throw new Error("Staff unavailable");
  }

  if (startTime < availability.startTime || startTime > availability.endTime) {
    throw new Error("Outside availability hours");
  }

  // 🔹 3. Calculate end time
  const endTime = addMinutes(startTime, duration + buffer);

  // 🔹 4. Conflict detection
  const conflict = await Appointment.findOne({
    staff: staffId,
    date,
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      },
    ],
  });

  if (conflict) {
    throw new Error("Time slot already booked");
  }

  // 🔹 5. Create appointment
  const appointment = await Appointment.create({
    staff: staffId,
    client: clientId,
    date,
    startTime,
    endTime,
    service,
    subService,
    reason,
  });

  await sendNotification(
    staffId,
    "New Booking",
    "A client booked a session with you",
  );

  await sendNotification(
    clientId,
    "Booking Confirmed",
    "Your appointment has been scheduled",
  );

  return appointment;
};
