import { Response } from "express";
import { Appointment } from "./appointment.model";
import { createAppointmentService } from "./appointment.service";

// ========================================
// 📅 GET ALL CLIENT APPOINTMENTS
// ========================================
export const getClientAppointments = async (req: any, res: Response) => {
  const appointments = await Appointment.find({
    client: req.user.id,
  }).populate("staff", "name email");

  res.json({ message: "Fetched appointments successfully", appointments });
};

// ========================================
// 🔍 GET SINGLE APPOINTMENT
// ========================================
export const getSingleAppointment = async (req: any, res: Response) => {
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    client: req.user.id,
  }).populate("staff", "name email");

  if (!appointment) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json({ message: "Appointment fetched successfully", appointment });
};

export const createAppointment = async (req: any, res: Response) => {
  const result = await createAppointmentService({
    ...req.body,
    clientId: req.user.id,
  });

  if (!result.success) {
    return res.status(400).json({
      message: result.message,
    });
  }

  return res.status(201).json({
    message: result.message,
    appointment: result.data,
  });
};

export const cancelAppointment = async (req: any, res: Response) => {
  const { id, reason } = req.body;

  const appointment = await Appointment.findOne({
    _id: id,
    client: req.user.id,
  });

  if (!appointment) return res.status(404).json({ message: "Not found" });

  appointment.status = "cancelled";
  appointment.cancelReason = reason;

  await appointment.save();

  res.json({ message: "Cancelled" });
};

export const rescheduleAppointment = async (req: any, res: Response) => {
  const { id, newDate, newStartTime, serviceId } = req.body;

  const appointment = await Appointment.findOne({
    _id: id,
    client: req.user.id,
  });

  if (!appointment) {
    return res.status(404).json({ message: "Not found" });
  }

  if (appointment.status === "completed") {
    return res.status(400).json({
      message: "Completed appointments cannot be rescheduled",
    });
  }

  // 🔥 VALIDATE using service (no creation)
  const result = await createAppointmentService({
    staffId: appointment.staff,
    clientId: appointment.client,
    date: newDate,
    startTime: newStartTime,
    serviceId,
    service: appointment.service,
    subService: appointment.subService,
    reason: appointment.reason,
    type: appointment.type,
    excludeAppointmentId: appointment._id, // ✅ CRITICAL
  });

  if (!result.success || !result.data) {
    return res.status(400).json({
      message: result.message,
    });
  }

  // ✅ UPDATE IN-PLACE
  appointment.date = newDate;
  appointment.startTime = newStartTime;
  appointment.endTime = result.data.endTime;
  appointment.duration = result.data.duration;
  appointment.buffer = result.data.buffer;

  // Optional: regenerate meeting link if virtual
  if (appointment.type === "virtual") {
    appointment.meetingLink = result.data.meetingLink;
  }

  await appointment.save();

  return res.status(200).json({
    message: "Appointment updated successfully",
    appointment,
  });
};

// ========================================
// RATE APPOINTMENT
// ========================================
export const rateAppointment = async (req: any, res: Response) => {
  const { id, rating, remarks } = req.body;

  const appointment = await Appointment.findOne({
    _id: id,
    client: req.user.id,
  });

  if (!appointment) {
    return res.status(404).json({ message: "Not found" });
  }

  appointment.rating = rating;
  appointment.remarks = remarks;

  await appointment.save();

  res.json(appointment);
};

export const addSessionNote = async (req: any, res: Response) => {
  const { id, note } = req.body;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return res.status(404).json({ message: "Not found" });
  }

  appointment.sessionNotes.push({
    user: req.user.id,
    note,
  });

  await appointment.save();

  res.json({ message: "Note added successfully", appointment });
};

export const deleteAppointment = async (req: any, res: Response) => {
  const { id } = req.params;

  const appointment = await Appointment.findOne({
    _id: id,
    client: req.user.id,
  });

  if (!appointment) {
    return res.status(404).json({ message: "Not found" });
  }

  if (!["cancelled", "absent"].includes(appointment.status)) {
    return res.status(400).json({
      message: "Only cancelled or absent appointments can be deleted",
    });
  }

  await appointment.deleteOne();

  res.json({ message: "Appointment deleted successfully" });
};
