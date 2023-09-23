import { Router } from "express";
import { addProfilePhoto, getAllUsers, profile, updateProfile } from "./controller/user.controller.js";
import { uploadImage, uploadValidation } from "../../multer/multer.cloud.js";
import { authMiddleware } from "../../middleware/authentication.js";
import { validate } from "../../middleware/validate.js";
import { updateProfileValidations } from "./controller/user.validation.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/addPhoto", authMiddleware, uploadImage(uploadValidation.image).single("profile-pic"), addProfilePhoto);
userRouter.put("/update", authMiddleware, validate(updateProfileValidations), updateProfile)
userRouter.get("/profile", authMiddleware, profile);

export default userRouter; 
