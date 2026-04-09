import { Availability } from "../availability/availability.model";
import { Appointment } from "./appointment.model";
import { addMinutes } from "@/utils/booking.util";
import { sendNotification } from "../notifications/notification.service";
import { Service } from "../services/service.model";

export const createAppointmentService = async ({
  staffId,
  serviceId,
  clientId,
  date,
  startTime,
  service,
  subService,
  reason,
  type,
  excludeAppointmentId,
}: any) => {
  try {
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
      return { success: false, message: "Staff unavailable" };
    }

    if (
      startTime < availability.startTime ||
      startTime > availability.endTime
    ) {
      return { success: false, message: "Outside availability hours" };
    }

    // 🔹 3. Get service config
    const serviceDoc = await Service.findById(serviceId);

    if (!serviceDoc) {
      return { success: false, message: "Service not found" };
    }

    const duration = serviceDoc.schedules?.[0]?.duration;
    const buffer = serviceDoc.schedules?.[0]?.buffer;

    if (!duration && duration !== 0) {
      return { success: false, message: "Service duration missing" };
    }

    if (!buffer && buffer !== 0) {
      return { success: false, message: "Service buffer missing" };
    }

    // 🔹 4. Calculate end time
    const endTime = addMinutes(startTime, duration + buffer);

    const meetingLink =
      type === "virtual"
        ? `lekota.room.${Math.floor(1000 + Math.random() * 9000)}`
        : null;

    // 🔹 5. Conflict detection
    const conflict = await Appointment.findOne({
      staff: staffId,
      date,
      _id: { $ne: excludeAppointmentId },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (conflict) {
      return { success: false, message: "Time slot already booked" };
    }

    const existing = await Appointment.findOne({
      client: clientId,
      date,
      _id: { $ne: excludeAppointmentId },
    });

    if (existing) {
      return {
        success: false,
        message: "You already have an appointment on this day",
      };
    }

    if (excludeAppointmentId) {
      return {
        success: true,
        message: "Validated",
        data: { endTime, duration, buffer, meetingLink },
      };
    }

    // 🔹 6. Create appointment
    const appointment = await Appointment.create({
      staff: staffId,
      client: clientId,
      serviceId,
      date,
      startTime,
      endTime,
      duration,
      buffer,
      type,
      meetingLink,
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

    return {
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    };
  } catch (error) {
    console.error("CREATE APPOINTMENT ERROR:", error);

    return {
      success: false,
      message: "Something went wrong while booking appointment",
    };
  }
};
