import { Router } from "express";
import {bookValidation} from "./controller/book.validation.js"
import { uploadImage, uploadValidation } from "../../multer/multer.cloud.js";

import {
    allBook,
    addBook,
    updateBook,
    bookByCategory,
    getBook,
    booksByFavCats,
    booksBySearchedCats,
    searchedBooks,
    forYou,
    updateData,
    getAuthors,
    addPdfUrl
} from "./controller/book.controller.js"
import { validate } from "../../middleware/validate.js";
import { isLoggedIn } from "../../middleware/isLoggedIn.js";
import { authMiddleware } from "../../middleware/authentication.js";

const bookRouter = Router();

bookRouter.get("/", allBook);
bookRouter.get("/category",bookByCategory);
bookRouter.get("/fav-cats", authMiddleware, booksByFavCats);
bookRouter.get("/author", getAuthors);
bookRouter.get("/searched-cats", authMiddleware, booksBySearchedCats);
bookRouter.get("/searched-books", authMiddleware, searchedBooks);
bookRouter.get("/for-you", authMiddleware, forYou);
bookRouter.get("/:slug", isLoggedIn, getBook);
bookRouter.post("/addBook",uploadImage(uploadValidation.image).single("image"),validate(bookValidation),addBook);
bookRouter.patch("/:bookId",validate(bookValidation),updateBook);

// bookRouter.put("/updateMany", updateData)

// bookRouter.post("/updatedata", updateData)
bookRouter.post("/updateurl",uploadImage(uploadValidation.pdf).any("pdf"), addPdfUrl)
export default bookRouter;