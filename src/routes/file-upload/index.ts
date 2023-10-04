import { Request, Response } from "express";

const fileUploadController = (req: Request, res: Response) => {
  console.log(req.file);
  const filePath = req.file?.path || "";
  const publicRoute = filePath.replace("public/", "");
  res.json(publicRoute);
};

export default fileUploadController;
