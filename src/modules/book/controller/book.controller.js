import bookModel from "../../../../DB/models/book.model.js";
import categoryModel from "../../../../DB/models/category.model.js";
import cloudinary from "../../../multer/cloudinary.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";

export const allBook = catchError(async (req, res, next) => {
  const books = await bookModel.find();
  if (books) {
    res.json({ message: "success", books });
  } else {
    throw new AppError("There is no data", 403);
  }
});
export const bookBy = catchError(async (req, res, next) => {
  let filterObj = req.query
      console.log(filterObj);
      filterObj = JSON.stringify(filterObj)
      filterObj = filterObj.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
      filterObj = JSON.parse(filterObj)
      console.log(filterObj);
        // const mongooseQuery = usersModel.find(filterObj).skip(SKIP).limit(PAGE_LIMIT)
        // this.mongooseQuery.find(filterObj)
  // const {name, ISBN, grt, lst } = req.query 
  // console.log(req.query);
  // const book = await bookModel.find({
  //   $or:{
  //     bookName: name,
  //     price: {$lt: 500}
  // }}).where({
  //   ISBN
  // });
  const book = await bookModel.find(filterObj)
  console.log(book);
  if (book) {
    res.json({ message: "success", book });
  } else {
    throw new AppError("There is no data", 403);
  }
});
export const addBook = catchError(async (req, res, next) => {
  const { ISBN } = req.body;
  const existBook = await bookModel.findOne({ ISBN });
  if (existBook) {
    throw new AppError("Book already exist", 403);
  }

  const book = await bookModel.create(req.body);
  book.save();
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

    const bookImage = await bookModel.findByIdAndUpdate(
      book._id,
      {
        image: { public_id, secure_url },
      },
      { new: true }
    );
    res.json({ message: "success", user });
  } else {
    throw new AppError("In-Valid Upload Photo", 403);
  }
  res.json({ message: "success", book });
});
export const updateBook = catchError(async (req, res, next) => {
  const { bookId } = req.params;
  const {
    bookName,
    lang,
    desc,
    pages,
    image,
    stock,
    price,
    discount,
    author,
    publisher,
    published,
    category,
  } = req.body;
  const book = await bookModel.findById(bookId);
  if (!book) {
    throw new AppError("Book Not found", 403);
  }
  console.log(book);
  const categoryInfo = await categoryModel.findById(category);
  await bookModel.findByIdAndUpdate(
    id,
    {
      bookName: bookName,
      lang: lang,
      desc: desc,
      pages: pages,
      //   image: { public_id, secure_url },
      stock: stock,
      price: price,
      discount: discount,
      author: author,
      publisher: publisher,
      published: published,
      category: category,
    },
    { new: true }
  );
  res.json({ message: "success", book });
});