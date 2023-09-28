import { Request, Response } from "express";

const fileUploadController = (req: Request, res: Response) => {
  res.send("Hello from new route2!");
};

export default fileUploadController;
