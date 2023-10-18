import bookModel from "../../../../DB/models/book.model.js";
import categoryModel from "../../../../DB/models/category.model.js";
import cloudinary from "../../../multer/cloudinary.js";
import { ApiFeatures } from "../../../util/ApiFeatures.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";
import { getData, getDocById } from "../../../util/model.util.js";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
export const allBook = catchError(getData(bookModel));

export const filterBook = catchError(async (req, res) => {
  let filterObj = req.query;
  const delObj = ["page", "sort", "fields", "keyword"];
  delObj.forEach((ele) => {
    delete filterObj[ele];
  });
  filterObj = JSON.stringify(filterObj);
  filterObj = filterObj.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
  filterObj = JSON.parse(filterObj);
  const book = await bookModel.find(filterObj);
  res.json({ massege: "success", book });
});
export const searchBook = catchError(async (req, res, next) => {
  let filterObj = req.query;
  const book = await bookModel.find({
    $or: [
      { bookName: { $regex: filterObj.keyword, $options: "i" } },
      { desc: { $regex: filterObj.keyword, $options: "i" } },
      { author: { $regex: filterObj.keyword, $options: "i" } },
      { publisher: { $regex: filterObj.keyword, $options: "i" } },
    ],
  });
  res.json({ massege: "success", book });
});
export const getBook = catchError(getDocById(bookModel));

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
  res.json({ message: "success", book });
});
export const updateBook = catchError(async (req, res, next) => {
  const { bookId } = req.params;
  const {
    isbn,
    bookName,
    lang,
    desc,
    pages,
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
  await bookModel.findByIdAndUpdate(
    book._id,
    {
      ISBN: isbn,
      bookName: bookName,
      lang: lang,
      desc: desc,
      pages: pages,
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
  let { category } = req.query;

  const book = await bookModel.find({ category: category });
  res.json({ massege: "success", book });
});

export const updateMan = catchError(async (req, res, next) => {
  await bookModel.updateMany(
    {},
    { $rename: { bookName: "name" } },
    { multi: true },
    async function (err, blocks) {
      console.log(err);
      if (err) {
        throw err;
      }
      console.log("done!");
    }
  );
  let result = await bookModel.find();
  res.json(result);
});

export const updateData = catchError(async (req, res) => {
  let result = await bookModel.find();

  const options = result.map((el) => (
    {
      updateOne: {
        filter: {_id: el._id},
        update: { $set: {slug: `${slugify(el.name.toLocaleLowerCase())}-${uuidv4().split("-")[0].substring(0, 6)}`} },
      },
    }
  ));
  console.log(options);
 const x =  await bookModel.bulkWrite(options);
 console.log(x);
  result = await bookModel.find()
  res.json(result)
});
