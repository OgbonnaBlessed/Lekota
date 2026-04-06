import { Response } from "express";
import { Availability } from "./availability.model";

export const setAvailability = async (req: any, res: Response) => {
  const { schedules } = req.body

  // Remove old
  await Availability.deleteMany({ staff: req.user.id });

  // Only save ENABLED days
  const filtered = schedules
    .filter((s: any) => s.enabled)
    .map((s: any) => ({
      staff: req.user.id,
      day: s.day,
      startTime: s.start_time,
      endTime: s.end_time,
    }));

    console.log(filtered)

  if (filtered.length > 0) {
    await Availability.insertMany(filtered);
  }

  res.json({ message: "Availability updated" });
};

export const getAvailability = async (req: any, res: Response) => {
  const availability = await Availability.find({
    staff: req.user.id,
  });

  res.json(availability);
};
