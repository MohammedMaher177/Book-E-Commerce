import { Router } from "express";
import { addProfilePhoto, getAllUsers } from "./controller/user.controller.js";
import { uploadImage, uploadValidation } from "../../multer/multer.cloud.js";
import { authMiddleware } from "../../middleware/authentication.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/addPhoto", authMiddleware, uploadImage(uploadValidation.image).single("profile-pic"), addProfilePhoto);

export default userRouter;
