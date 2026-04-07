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

  res.json(appointments);
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

  res.json(appointment);
};

export const createAppointment = async (req: any, res: Response) => {
  const appointment = await createAppointmentService({
    ...req.body,
    clientId: req.user.id,
  });

  console.log(appointment);
  res.json(appointment);
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
  const { id, newDate, newStartTime } = req.body;

  const old = await Appointment.findOne({
    _id: id,
    client: req.user.id,
  });

  if (!old) return res.status(404).json({ message: "Not found" });

  const newAppointment = await createAppointmentService({
    staffId: old.staff,
    clientId: old.client,
    date: newDate,
    startTime: newStartTime,
    duration: 30,
    buffer: 10,
    // service: old.service,
    // subService: old.subService,
    reason: old.reason,
  });

  old.status = "cancelled";
  await old.save();

  res.json(newAppointment);
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
