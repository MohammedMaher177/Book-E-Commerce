import { Router } from "express";
import { addProfilePhoto,
     addToFavCat,
      getAllUsers,
       profile,
        updateProfile,
        addWhishList
    } from "./controller/user.controller.js";
import { uploadImage, uploadValidation } from "../../multer/multer.cloud.js";
import { authMiddleware } from "../../middleware/authentication.js";
import { validate } from "../../middleware/validate.js";
import { favoritsCatsValidations, updateProfileValidations, wishListValidations } from "./controller/user.validation.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.post("/addPhoto", authMiddleware, uploadImage(uploadValidation.image).single("profile-pic"), addProfilePhoto);
userRouter.put("/update", authMiddleware, validate(updateProfileValidations), updateProfile);
userRouter.patch("/add-to-fav-cats", authMiddleware, validate(favoritsCatsValidations),addToFavCat),
userRouter.get("/profile", authMiddleware, profile);

userRouter.post("/wishList",authMiddleware,validate(wishListValidations),addWhishList);
// userRouter.delete("/wishList",authMiddleware,validate(wishListValidations),deleteWhishList);

export default userRouter; 
