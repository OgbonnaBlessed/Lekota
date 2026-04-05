import { Request, Response } from "express";
import { generateTimeSlots } from "./slot.service";

export const getAvailableSlots = async (req: Request, res: Response) => {
  const { staffId, date, duration } = req.query;

  const slots = await generateTimeSlots({
    staffId: staffId as string,
    date: date as string,
    duration: Number(duration),
  });

  res.json(slots);
};
