import bookModel from "../../../../DB/models/book.model.js";
import categoryModel from "../../../../DB/models/category.model.js";
import cloudinary from "../../../multer/cloudinary.js";
import { ApiFeatures } from "../../../util/ApiFeatures.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";
import { getData, getDocById } from "../../../util/model.util.js";
import { shuffle, suggestCategory } from "../../../util/helper-functions.js";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

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
  const book = await bookModel.findById(bookId);
  if (!book) {
    throw new AppError("Book Not found", 404);
  }
  await bookModel.findByIdAndUpdate(book._id, req.body, { new: true });
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
  const { slug } = req.query;
  const category = await categoryModel.findOne({ slug: slug });
  if (!category) {
    throw new AppError("category Not Found", 403);
  }
  req.query._id = {
    name: "category",
    value: category._id,
  };
  delete req.query.slug;
  getData(bookModel)(req, res);
});

export const booksByFavCats = catchError(async (req, res, next) => {
  const fav_cats = req.user.fav_cats.map((ele) => ele._id);
  const args = {
    name: "category",
    value: fav_cats,
  };
  const apiFeatures = await new ApiFeatures(
    bookModel.find(),
    req.query,
    args
  ).getByArrOfIDs();
  const result = await apiFeatures.mongooseQuery;
  res.status(200).json({
    message: "success",
    ...(apiFeatures.queryString.page !== undefined
      ? {
          page: apiFeatures.queryString.page || 1,
          totalCount: apiFeatures.totalCount,
        }
      : ""),
    result,
  });
});

export const booksBySearchedCats = catchError(async (req, res, next) => {
  const { searchedCats } = req.user;
  const args = {
    name: "category",
    value: searchedCats,
  };
  const apiFeatures = await new ApiFeatures(
    bookModel.find(),
    {},
    args
  ).getByArrOfIDs();
  const result = await apiFeatures.mongooseQuery;
  res.status(200).json({
    message: "success",
    ...(apiFeatures.queryString.page !== undefined
      ? {
          page: apiFeatures.queryString.page || 1,
          totalCount: apiFeatures.totalCount,
        }
      : ""),
    result,
  });
});

export const searchedBooks = catchError(async (req, res, next) => {
  const { searchedBooks } = req.user;
  const args = {
    name: "_id",
    value: searchedBooks,
  };
  const apiFeatures = await new ApiFeatures(
    bookModel.find(),
    {},
    args
  ).getByArrOfIDs();
  let result = await apiFeatures.mongooseQuery;
  res.status(200).json({
    message: "success",
    ...(apiFeatures.queryString.page !== undefined
      ? {
          page: apiFeatures.queryString.page || 1,
          totalCount: apiFeatures.totalCount,
        }
      : ""),
    result,
  });
});
export const forYou = catchError(async (req, res, next) => {
  const { searchedCats, fav_cats } = req.user;
  let fav = fav_cats.map((ele) => ele._id);
  fav = fav.concat(searchedCats);
  console.log(fav);
  fav = fav.map((el) => el.toString());
  const categories = new Set(fav);
  console.log(categories);

  let result = await suggestCategory(categories);
  result = shuffle(result);
  res.status(200).json({
    message: "success",
    result,
  });
});

export const updateData = catchError(async (req, res) => {
  let result = await bookModel.find();
  result = result.map((el) => {
    let n = uuidv4();
    n = n.split("-")[0].substring(0, 6);
    el.slug = slugify(el.name) + "-" + n;
    return el;
  });
  const option = {
    slug: slugify(),
  };
  await result.save();
  // result.bulkWrite({
  //   updateOne{
  //     flter:{$exis}
  //   }
  // })
  res.json(result);
});

export const getAuthors = catchError(async (req, res) => {
  const authors = await bookModel.find().distinct("author");
  res.json({ message: "success", authors });
});

