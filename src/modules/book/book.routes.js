import { Router } from "express";
import {bookValidation} from "./controller/book.validation.js"
import { uploadImage, uploadValidation } from "../../multer/multer.cloud.js";

import {
    allBook,
    addBook,
    updateBook,
    bookByCategory,
    getBook
} from "./controller/book.controller.js"
import { validate } from "../../middleware/validate.js";

const bookRouter = Router();

bookRouter.get("/",allBook);
bookRouter.get("/category",bookByCategory);
bookRouter.post("/addBook",uploadImage(uploadValidation.image).single("image"),validate(bookValidation),addBook);
bookRouter.get("/:id",getBook);
bookRouter.patch("/:bookId",validate(bookValidation),updateBook);


export default bookRouter;