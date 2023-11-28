import bookModel from "../../../../DB/models/book.model.js";
import reviewModel from "../../../../DB/models/review.model.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";
import { getRating } from "../../../util/helper-functions.js";
import { deleteData, getData, getDocById } from "../../../util/model.util.js";


export const getAllReviews = catchError(getData(reviewModel));

export const getReview = catchError(async(req,res,next)=>{
  const {id}= req.params;
  const review = await reviewModel.findById(id)
  return res.status(200).json({ message: "success", review });
});

export const addReview = catchError(async (req, res, next) => {
  req.body.user = req.user._id.toHexString();
  const { book } = req.body;
  const existBook = await bookModel.findById(book);
  if (!existBook) {
    return next(new AppError("In-Valid Book id", 404));
  }
  const isReview = await reviewModel.findOne({
    user: req.user._id,
    book: req.body.book,
  });
  if (isReview) {
    return next(new AppError("You Created review before", 409));
  }
  const result = await reviewModel.create(req.body);
  existBook.reviews.push(result._id);
  existBook.rating =await getRating(existBook._id);
  existBook.save();
  const newReview = await reviewModel.findOne({
    user: req.user._id,
    book: req.body.book,
  });
  return res.json({ message: "success", newReview });
});

export const UpdateReview = catchError(async (req, res, next) => {
  const userId = req.user._id.toHexString();
  const { id } = req.params;
  const review = await reviewModel.findById(id);

  if (!review) {
    return next(new AppError("Not Found", 404));
  }
  if (review.user._id.toHexString() !== userId) {
    return next(new AppError("Not Authorized", 401));
  }
  review.content = req.body.content || review.content;
  review.rating = req.body.rating || review.content;
  await review.save();
  const existBook = await bookModel.findById(review.book);
  existBook.rating =await getRating(review.book);
  existBook.save();
  res.status(201).json({ message: "success", review });
});

export const deleteReview = catchError(deleteData(reviewModel));
// export const deleteReview = catchError(async(res,req)=>{
//   const { id } = req.params;
//   const result = await reviewModel.findById(id);
//   if (!result) {
//     return next(new AppError("Not Found", 404));
//   }
//   if (result.user) {
//     if (result.user._id.toHexString() !== req.user._id.toHexString()) {
//       return next(new AppError("Not Authorized", 401));
//     }
//   }
//   await reviewModel.findByIdAndDelete(id)
//     const existBook = await bookModel.findById(result.book);
    
//     existBook.reviews = await reviewModel.find({book:existBook._id})
//     if (!(await getRating(existBook._id))) {
//       existBook.rating=0
//     }else{
//       existBook.rating = await getRating(existBook._id);
//     }

//     existBook.save();
  
//   res.status(201).json({ message: "success"  });
// });
