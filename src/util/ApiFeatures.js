import mongoose from "mongoose";
import bookModel from "../../DB/models/book.model.js";
import categoryModel from "../../DB/models/category.model.js";

export class ApiFeatures {
  totalCount;
  constructor(mongooseQuery, queryString = {}, args = {}) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
    this.args = args;
    this.totalCount = 0;
  }

  #pagination() {
    //1 - pag
    const PAGE_LIMIT = this.queryString.page ? 12 : true;
    // const PAGE_LIMIT = 12;
    const PAGE_NUMBER = this.queryString.page || 1;
    if (PAGE_NUMBER <= 0) PAGE_NUMBER = 1;
    const SKIP = (PAGE_NUMBER - 1) * PAGE_LIMIT;
    this.mongooseQuery.skip(SKIP).limit(PAGE_LIMIT);
    return this;
  }

  async #filter() {
    let filterObj = { ...this.queryString };
    const delObj = ["page", "sort", "fields", "keyword"];
    delObj.forEach((ele) => {
      delete filterObj[ele];
    });
    console.log(filterObj);
    let finalFilter = {};
    for (const key in filterObj) {
      if (key === "price") {
        let val = filterObj[key].split("-");
        val[0] = Number(val[0].replace(/["]/g, (match) => (match = "")));
        val[1] = Number(val[1].replace(/["]/g, (match) => (match = "")));
        finalFilter[key] = { $gte: val[0], $lte: val[1] };
      }
      if (key === "published") {
        let published = filterObj[key];
        if (typeof published === "string") {
          let val = filterObj[key].split("-");
          val[0] = Number(val[0].replace(/["]/g, (match) => (match = "")));
          val[1] = Number(val[1].replace(/["]/g, (match) => (match = "")));
          finalFilter[key] = { $gte: val[0], $lte: val[1] };
        } else {
          published.forEach((ele) => {
            let val = ele.split("-");
            val[0] = Number(val[0].replace(/["]/g, (match) => (match = "")));
            val[1] = Number(val[1].replace(/["]/g, (match) => (match = "")));
            const old = finalFilter["$or"] || [];
            finalFilter["$or"] = [
              ...old,
              { [key]: { $gte: val[0], $lte: val[1] } },
            ];
          });
        }
      }
      
      if (
        key === "author" ||
        key === "publisher" ||
        key === "lang" ||
        key === "format"
      ) {
        let elements = filterObj[key].split(",");
        elements.map((el) => el.replace(/[^\w\s]/gi, (match) => `\\${match}`));
        const options = elements.map((el) => new RegExp(el, "i"));
        finalFilter[key] = { $in: options };
      }
      if (key === "category") {
        let elements = filterObj[key].split(",");
        let c = await categoryModel
          .find({
            slug: { $in: elements },
          })
          .select("_id");
        finalFilter.category = { $in: c.map((ele) => ele._id) };
      }
    }
    this.totalCount = await this.mongooseQuery
      .find(finalFilter)
      .count()
      .clone();
    this.mongooseQuery.find(finalFilter);

    return this;
  }

  #sort() {
    if (this.queryString.sort) {
      let sortedQery = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery.sort(sortedQery);
    }
    return this;
  }

  //4 - search
  async #search() {
    if (this.queryString.keyword) {
      let key = this.queryString.keyword.replace(
        /[^\w\s]/gi,
        (match) => `\\${match}`
      );
      this.totalCount = await this.mongooseQuery
        .find({
          $or: [
            { name: { $regex: key, $options: "i" } },
            { slug: { $regex: key, $options: "i" } },
            // { desc: { $regex: this.queryString.keyword, $options: "i" } },
            // { author: { $regex: this.queryString.keyword, $options: "i" } },
            // { publisher: { $regex: this.queryString.keyword, $options: "i" } },
          ],
        })
        .count()
        .clone();
      this.mongooseQuery
        .find({
          $or: [
            { name: { $regex: key, $options: "i" } },
            { slug: { $regex: key, $options: "i" } },
            // { desc: { $regex: this.queryString.keyword, $options: "i" } },
            // { author: { $regex: this.queryString.keyword, $options: "i" } },
            // { publisher: { $regex: this.queryString.keyword, $options: "i" } },
          ],
        })
        .clone();
    }
    return this;
  }

  //5 - fields
  #fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      fields = fields.replace("password", "");
      this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery.select("-password");
    }
    return this;
  }

  async #byArrOfIDs() {
    const { name, value } = this.args;
    this.totalCount = await this.mongooseQuery
      .find({ [name]: { $in: value } })
      .count()
      .clone();
    this.mongooseQuery.find({ [name]: { $in: value } });
    return this;
  }

  async initialize() {
    await this.#filter();
    await this.#search();
    this.#fields();
    this.#sort();
    this.#pagination();
    return this;
  }

  async getByArrOfIDs() {
    await this.#byArrOfIDs();
    this.#pagination();
    return this;
  }
}

/*
filterObj = {
  name: [],
  price: {$gt:22, $lt:33},
  category: [],
  author: [],
  publisher: [],
  publishe:{$gt:22, $lt:33}
}
filterObj = {
  category: [],
  author: [],
  publisher: [],
  publishe:{$gt:22, $lt:33}
}
*/
