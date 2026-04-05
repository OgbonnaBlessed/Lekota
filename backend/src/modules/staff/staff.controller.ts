import { Response } from "express";
import { Appointment } from "../appointments/appointment.model";
import { sendNotification } from "../notifications/notification.service";
import { User } from "../users/user.model";


// ========================================
// 👤 UPDATE STAFF PROFILE
// ========================================
export const updateStaffProfile = async (req: any, res: Response) => {
  const updates = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { ...updates } },
    { new: true }
  );

  await sendNotification(
    req.user.id,
    "Profile Updated",
    "Your profile was successfully updated"
  );

  res.json(user);
};


// ========================================
// 📅 GET STAFF SCHEDULES
// ========================================
export const getStaffSchedules = async (req: any, res: Response) => {
  const schedules = await Appointment.find({
    staff: req.user.id,
  }).populate("client", "name email");

  res.json(schedules);
};


// ========================================
// 🔍 GET SINGLE SCHEDULE
// ========================================
export const getSingleSchedule = async (req: any, res: Response) => {
  const schedule = await Appointment.findOne({
    _id: req.params.id,
    staff: req.user.id,
  }).populate("client", "name email");

  if (!schedule) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(schedule);
};


// ========================================
// ✅ UPDATE APPOINTMENT STATUS
// ========================================
export const updateAppointmentStatus = async (req: any, res: Response) => {
  const { id, status, sessionNotes } = req.body;

  const appointment = await Appointment.findOne({
    _id: id,
    staff: req.user.id,
  });

  if (!appointment) {
    return res.status(404).json({ message: "Not found" });
  }

  appointment.status = status;
  appointment.sessionNotes = sessionNotes || "";

  await appointment.save();

  // 🔔 notify client
  if (appointment.client) {
    await sendNotification(
      appointment.client.toString(),
      "Appointment Update",
      `Your appointment was marked as ${status}`
    );
  }

  res.json(appointment);
};