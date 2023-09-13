import { Router } from "express";
import {bookValidation} from "./controller/book.validation.js"
import {
    addBook,
    updateBook
} from "./controller/book.controller.js"
import { validate } from "../../middleware/validate.js";

const bookRouter = Router();

bookRouter.post("/addBook",validate(bookValidation),addBook);
bookRouter.patch("/:bookId",validate(bookValidation),updateBook);


export default bookRouter;