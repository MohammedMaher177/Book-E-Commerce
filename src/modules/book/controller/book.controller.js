import bookModel from "../../../../DB/models/book.model.js";
import categoryModel from "../../../../DB/models/category.model.js";
import cloudinary from "../../../multer/cloudinary.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";
import { getData } from "../../../util/model.util.js";


export const allBook = catchError(getData(bookModel))


export const addBook = catchError(async (req, res, next) => {
  const { ISBN } = req.body;
  const existBook = await bookModel.findOne({ ISBN });
  if (existBook) {
    throw new AppError("Book already exist", 403);
  }
  const book = await bookModel.create(req.body);
  if (req.file) {
    if (book.image.public_id) {
      const { result } = await cloudinary.uploader.destroy(
        `${book.image.public_id}`,
        (result) => {
          return result;
        }

      );
    }
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `BookStore/Book/${book._id}` }
    );

    const bookWithImage = await bookModel.findByIdAndUpdate(
      book._id,
      {
        image: { public_id, secure_url },
      },
      { new: true }
    );
    res.json({ message: "success", bookWithImage });
  } else {
    throw new AppError("In-Valid Upload Photo", 403);
  }
  res.json({ message: "success",book });
});
export const updateBook = catchError(async (req, res, next) => {
  const { bookId } = req.params;
  const book = await bookModel.findById(bookId);
  if (!book) {
    throw new AppError("Book Not found", 403);
  }
  await bookModel.findByIdAndUpdate(book._id, req.body,{ new: true });
  if (req.file) {
    if (book.image.public_id) {
      const { result } = await cloudinary.uploader.destroy(
        `${book.image.public_id}`,
        (result) => {
          return result;
        }

      );
    }
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `BookStore/Book/${book._id}` }
    );

    const bookWithImage = await bookModel.findByIdAndUpdate(
      book._id,
      {
        image: { public_id, secure_url },
      },
      { new: true }
    );
    res.json({ message: "success", bookWithImage });
  } 
  res.json({ message: "success", book });
});
export const bookByCategory = catchError(async (req, res) => {
  const {slug} = req.query;
 const category = await categoryModel.findOne({slug:slug})
 if (!category) {
  throw new AppError("category Not Found", 403);
}
  const book = await bookModel.find({category:category._id});
  res.json({ massege: "success", book });
});