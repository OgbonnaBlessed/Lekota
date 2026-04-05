import { Response } from "express";
import { Appointment } from "../appointments/appointment.model";
import { sendNotification } from "../notifications/notification.service";
import { User } from "../users/user.model";

// ========================================
// UPDATE CLIENT PROFILE
// ========================================
export const updateClientProfile = async (req: any, res: Response) => {
  const updates = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { ...updates } },
    { new: true },
  );

  await sendNotification(
    req.user.id,
    "Profile Updated",
    "Your profile was updated successfully",
  );

  res.json(user);
};

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

// ========================================
// ❌ CANCEL APPOINTMENT
// ========================================
export const cancelAppointment = async (req: any, res: Response) => {
  const { id, reason } = req.body;

  const appointment = await Appointment.findOne({
    _id: id,
    client: req.user.id,
  });

  if (!appointment) {
    return res.status(404).json({ message: "Not found" });
  }

  appointment.status = "cancelled";
  appointment.cancelReason = reason;

  await appointment.save();

  // notify staff
  if (appointment.staff) {
    await sendNotification(
      appointment.staff.toString(),
      "Appointment Cancelled",
      "A client cancelled an appointment",
    );
  }

  res.json({ message: "Cancelled" });
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
