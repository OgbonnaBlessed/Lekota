import { Response } from "express";
import { Appointment } from "../appointments/appointment.model";
import { sendNotification } from "../notifications/notification.service";
import { User } from "../users/user.model";
import { Service } from "../services/service.model";
import mongoose from "mongoose";

export const getStaffById = async (req: any, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid staff ID",
    });
  }

  const staff = await User.findById(id).select("-password");

  if (!staff) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    message: "Staff fetched successfully",
    staff,
  });
};

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
    phone: user.profile?.phone,
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

  if (service) {
    const validService = await Service.findOne({
      name: service,
      tenant: req.user.tenant,
      status: "active",
    });

    if (!validService) {
      return res.status(400).json({
        message: "Invalid service selected",
      });
    }

    updateData["profile.service"] = service;

    // Validate subservices
    if (sub_service) {
      const invalidSub = sub_service.find(
        (sub: string) => !validService.subServices.includes(sub),
      );

      if (invalidSub) {
        return res.status(400).json({
          message: `Invalid subservice: ${invalidSub}`,
        });
      }

      updateData["profile.sub_service"] = sub_service;
    }
  }

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

  await sendNotification({
    userId: req.user.id,
    title: "Profile Updated",
    body: "Your profile was updated successfully",
  });

  res.json({
    message: "Profile updated successfully",
    data: response,
  });
};

// ========================================
// 📅 GET STAFF SCHEDULES
// ========================================
export const getStaffSchedules = async (req: any, res: Response) => {
  const { type } = req.query; // upcoming | week | past

  const now = new Date();

  let filter: any = {
    staff: req.user.id,
  };

  if (type === "upcoming") {
    filter.date = { $gte: now };
  }

  if (type === "past") {
    filter.date = { $lt: now };
  }

  if (type === "week") {
    const startOfWeek = new Date();
    const endOfWeek = new Date();

    endOfWeek.setDate(startOfWeek.getDate() + 7);

    filter.date = {
      $gte: startOfWeek,
      $lte: endOfWeek,
    };
  }

  const schedules = await Appointment.find(filter)
    .sort({ date: 1, startTime: 1 })
    .populate("client", "name email profile.image");

  res.json({
    message: "Schedules fetched successfully",
    schedules,
  });
};

// ========================================
// 🔍 GET SINGLE SCHEDULE
// ========================================
export const getSingleSchedule = async (req: any, res: Response) => {
  const schedule = await Appointment.findOne({
    _id: req.params.id,
    staff: req.user.id,
  })
    .populate("client", "name email profile.image")
    .lean();

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

  // Notify client
  await sendNotification({
    userId: req.user.id,
    title: "Appointment Update",
    body: `Your appointment was marked as ${status}`,
  });

  res.json(appointment);
};
