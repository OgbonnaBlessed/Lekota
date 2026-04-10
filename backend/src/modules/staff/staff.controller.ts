import { Response } from "express";
import { Appointment } from "../appointments/appointment.model";
import { sendNotification } from "../notifications/notification.service";
import { User } from "../users/user.model";
import { Service } from "../services/service.model";
import mongoose from "mongoose";
import cloudinary from "../../config/cloudinary";
import streamifier from "streamifier";

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
    address: user.profile?.address,
    postcode: user.profile?.postcode,
    county: user.profile?.county,
    bio: user.profile?.bio,
    service: user.profile?.service,
    phone: user.profile?.phone,
    sub_service: user.profile?.sub_service,
    gender: user.profile?.gender,
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
    address,
    postcode,
    county,
    phone,
    bio,
    gender,
  } = req.body;

  const updateData: any = {};

  let imageUrl;

  if (req.file) {
    const streamUpload = () =>
      new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "lekota_profiles" },
          (error, result) => {
            if (result) resolve(result.secure_url);
            else reject(error);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    try {
      imageUrl = await streamUpload();
      updateData["profile.image"] = imageUrl;
    } catch (err) {
      return res.status(500).json({
        message: "Image upload failed",
      });
    }
  }

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

  if (address) updateData["profile.address"] = address;
  if (postcode) updateData["profile.postcode"] = postcode;
  if (county) updateData["profile.county"] = county;
  if (phone) updateData["profile.phone"] = phone;
  if (bio) updateData["profile.bio"] = bio;
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
    id: user.id,
    role: user.role,
    tenant: user.tenant,
    name: user.name,
    email: user.email,
    image: user.profile?.image,
    address: user.profile?.address,
    postcode: user.profile?.postcode,
    county: user.profile?.county,
    phone: user.profile?.phone,
    bio: user.profile?.bio,
    service: user.profile?.service,
    sub_service: user.profile?.sub_service,
    gender: user.profile?.gender,
  };

  await sendNotification({
    userId: req.user.id,
    title: "Profile Updated",
    body: "Your profile was updated successfully",
  });

  res.json({
    message: "Profile updated successfully",
    user: response,
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
  const { id } = req.params;

  // ✅ VALIDATE OBJECT ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid schedule ID",
    });
  }

  const schedule = await Appointment.findOne({
    _id: id,
    staff: req.user.id,
  })
    .populate("client", "name email profile.image")
    .lean();

  if (!schedule) {
    return res.status(404).json({ message: "Not found" });
  }

  const myNote = schedule.sessionNotes?.staffNote || "";

  res.json({
    message: "Schedule fetched successfully",
    schedule: {
      ...schedule,
      myNote,
    },
  });
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

  if (appointment.sessionNotes) {
    appointment.sessionNotes.staffNote = sessionNotes;
  }

  await appointment.save();

  res.json({
    message: "Appointment updated successfully",
    appointment,
  });
};
