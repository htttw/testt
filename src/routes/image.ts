import { Router } from "express";

import {
  loadImage,
  updateImage,
  getAllStore,
  updateStore,
} from "../controllers/image";

const ImageRouter = Router();

ImageRouter.get("/getAllStore", getAllStore);
ImageRouter.post("/upLoad",  loadImage);
ImageRouter.get("/loadImage/:store", loadImage);
ImageRouter.post("/updateImage", updateImage);
ImageRouter.get("/updateStore", updateStore);

export default ImageRouter;
