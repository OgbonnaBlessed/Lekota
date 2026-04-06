import { Response } from "express";
import { Appointment } from "../appointments/appointment.model";
import { sendNotification } from "../notifications/notification.service";
import { User } from "../users/user.model";

// ========================================
// 👤 GET STAFF PROFILE
// ========================================
export const getStaffProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const response = {
    name: user.name,
    email: user.email,
    image: user.profile?.image,
    location: user.profile?.location,
    bio: user.profile?.bio,
    service: user.profile?.service,
    sub_service: user.profile?.sub_service,
  };

  res.json(response);
};

// ========================================
// 👤 UPDATE STAFF PROFILE
// ========================================
export const updateStaffProfile = async (req: any, res: Response) => {
  const {
    name,
    email,
    service,
    sub_service,
    location,
    phone,
    bio,
    image,
    gender,
  } = req.body;

  const updateData: any = {};

  if (name) updateData.name = name;
  if (email) updateData.email = email;

  if (service) updateData["profile.service"] = service;
  if (sub_service) updateData["profile.sub_service"] = sub_service;
  if (location) updateData["profile.location"] = location;
  if (phone) updateData["profile.phone"] = phone;
  if (bio) updateData["profile.bio"] = bio;
  if (image) updateData["profile.image"] = image;
  if (gender) updateData["profile.gender"] = gender;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updateData },
    { new: true },
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // ✅ RETURN SAME SHAPE AS GET PROFILE
  const response = {
    name: user.name,
    email: user.email,
    image: user.profile?.image,
    location: user.profile?.location,
    phone: user.profile?.phone,
    bio: user.profile?.bio,
    service: user.profile?.service,
    sub_service: user.profile?.sub_service,
    gender: user.profile?.gender || "other",
  };

  res.json({
    message: "Profile updated successfully",
    data: response,
  });
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
      `Your appointment was marked as ${status}`,
    );
  }

  res.json(appointment);
};
