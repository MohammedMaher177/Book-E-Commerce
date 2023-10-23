import mongoose from "mongoose";

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
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    filterObj = JSON.parse(filterObj);
    if (filterObj._id !== undefined) {
      const { name, value } = filterObj._id;
      filterObj[name] = new mongoose.Types.ObjectId(value);
      delete filterObj._id;
    } else {
      delete filterObj._id;
    }
    this.totalCount = await this.mongooseQuery.find(filterObj).count().clone();
    this.mongooseQuery.find(filterObj);
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
      console.log(key);
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

  //author
  async #author() {
    if (this.queryString.author) {
      let key = this.queryString.author.replace(
        /[^\w\s]/gi,
        (match) => `\\${match}`
      );
      this.totalCount = await this.mongooseQuery
        .find({
          author: { $regex: key, $options: "i",  },
        })
        .count()
        .clone();
      this.mongooseQuery
        .find({
          $or: [{ author: { $regex: key, $options: "i" } }],
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
    await this.#author();
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
