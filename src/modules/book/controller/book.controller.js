import bookModel from "../../../../DB/models/book.model.js";
import categoryModel from "../../../../DB/models/category.model.js";
import { AppError } from "../../../util/ErrorHandler/AppError.js";
import { catchError } from "../../../util/ErrorHandler/catchError.js";


export const addBook = catchError(async (req,res, next)=>{
    const {ISBN}= req.body;
    const existBook = await bookModel.findOne({ISBN});
    if (existBook) {
        throw new AppError("Book already exist", 403);
    }
    
    const book = await bookModel.create(req.body);
    res.json({message: "success",book})
})
export const updateBook = catchError(async (req,res, next)=>{
    const {bookId}=req.params
    const {bookName ,lang ,desc ,pages ,image ,stock ,price,
        discount,author, publisher,published ,category}= req.body;
    const book = await bookModel.findById(bookId);
    if (!book) {
        throw new AppError("Book Not found", 403);
    }
    console.log(book);
    const categoryInfo = await categoryModel.findById(category);
     await bookModel.findByIdAndUpdate(
        id,
        {
            bookName:bookName,
            lang:lang,
            desc:desc,
            pages:pages, 
        //   image: { public_id, secure_url },
        stock:stock,
        price:price,
        discount:discount,
        author:author,
        publisher:publisher,
        published:published,
       category:category
        },
        { new: true }
      );
    res.json({message: "success",book})
})