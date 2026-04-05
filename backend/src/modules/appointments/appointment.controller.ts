import { Response } from "express";
import { Appointment } from "./appointment.model";
import { createAppointmentService } from "./appointment.service";

export const createAppointment = async (req: any, res: Response) => {
  const appointment = await createAppointmentService({
    ...req.body,
    clientId: req.user.id,
  });

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
    service: old.service,
    subService: old.subService,
    reason: old.reason,
  });

  old.status = "cancelled";
  await old.save();

  res.json(newAppointment);
};
