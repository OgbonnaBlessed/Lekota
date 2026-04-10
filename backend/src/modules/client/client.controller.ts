import { Response } from "express";
import { sendNotification } from "../notifications/notification.service";
import { User } from "../users/user.model";
import cloudinary from "../../config/cloudinary";
import streamifier from "streamifier";

export const getClientProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const response = {
    name: user.name,
    email: user.email,
    image: user.profile?.image,
    adress: user.profile?.address,
    postcode: user.profile?.postcode,
    county: user.profile?.county,
    bio: user.profile?.bio,
    phone: user.profile?.phone,
  };

  res.json(response);
};

// ========================================
// UPDATE CLIENT PROFILE
// ========================================
export const updateClientProfile = async (req: any, res: Response) => {
  const {
    name,
    email,
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
