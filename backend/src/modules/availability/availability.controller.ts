import { Response } from "express";
import { Availability } from "./availability.model";

export const setAvailability = async (req: any, res: Response) => {
  const { schedules } = req.body;

  // schedules = [{ day: "Mon", startTime, endTime }]

  await Availability.deleteMany({ staff: req.user.id });

  const data = schedules.map((s: any) => ({
    ...s,
    staff: req.user.id,
  }));

  await Availability.insertMany(data);

  res.json({ message: "Availability updated" });
};
