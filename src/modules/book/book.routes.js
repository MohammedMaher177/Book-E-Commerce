import { Router } from "express";
import {bookValidation} from "./controller/book.validation.js"
import { uploadImage, uploadValidation } from "../../multer/multer.cloud.js";

import {
    allBook,
    addBook,
    updateBook,
    bookByCategory
} from "./controller/book.controller.js"
import { validate } from "../../middleware/validate.js";

const bookRouter = Router();

bookRouter.get("/",allBook);
bookRouter.get("/category",bookByCategory);
bookRouter.post("/addBook",validate(bookValidation),uploadImage(uploadValidation.image).single("image"),addBook);
bookRouter.patch("/:bookId",validate(bookValidation),updateBook);


export default bookRouter;