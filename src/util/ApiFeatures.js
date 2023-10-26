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
    const delObj = ["page", "sort", "fields", "keyword", "author", "category"];
    delObj.forEach((ele) => {
      delete filterObj[ele];
    });
    console.log(filterObj);
    let val;
    let arr = [];
    Object.keys(filterObj).forEach(async (key) => {
      if (typeof filterObj[key] == "string") {
        filterObj = JSON.stringify(filterObj);
        filterObj = filterObj.split(":");
        filterObj[1] = filterObj[1].replace(/["]/g, (match) => (match = ""));
        val = filterObj[1].split("-");
        val = `{"$gte":${val[0]},"$lte":${val[1]}}`;
        filterObj[1] = val;
        filterObj = JSON.parse(filterObj.join(":"));
        console.log(filterObj);
        // this.totalCount = await this.mongooseQuery.find(filterObj).count().clone();
        this.mongooseQuery.find(filterObj);
      } else {
        filterObj[key].map((el) => {
          el = JSON.stringify(el);
          el = el.replace(/["]/g, (match) => (match = ""));
          val = el.split("-");
          val = `{"$gte":${val[0]},"$lte":${val[1]}}`;
          console.log(val);
          arr.push(`{"${key}":${val}}`);
        });
        arr = arr.map((el) => JSON.parse(el));
        console.log(arr);
        // this.totalCount = await this.mongooseQuery.find({$or: arr}).count().clone();
        this.mongooseQuery.find({$or: arr});
      }
    });

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
      let key = this.queryString.author.split(",");
      key.map((el) => el.replace(/[^\w\s]/gi, (match) => `\\${match}`));
      console.log(key);
      const options = key.map((el) => {
        return {
          author: { $regex: el, $options: "i" },
        };
      });
      this.totalCount = await this.mongooseQuery
        .find({
          $or: options,
        })
        .count()
        .clone();
      this.mongooseQuery
        .find({
          $or: options,
        })
        .clone();
    }
    return this;
  }

  //category
  async #category() {
    if (this.queryString.category) {
      let key = this.queryString.category.split(",");

      key.map((el) => el.replace(/[^\w\s]/gi, (match) => `\\${match}`));

      key = key.map((el) => el.replace(/[.]/gi, (match) => "&"));
      key = key.map((el) => el.replace(/[@]/gi, (match) => ","));
      const options = key.map((el) => {
        return {
          name: el,
        };
      });
      // console.log(options);
      let c = await categoryModel
        .find({
          $or: options,
        })
        .select("_id");
      c = c.map((el) => {
        return {
          category: el._id,
        };
      });
      console.log(c);
      if (c.length > 0) {
        this.totalCount = await this.mongooseQuery
          .find({
            $or: c,
          })
          .count()
          .clone();
        this.mongooseQuery
          .find({
            $or: c,
          })
          .clone();
      } else {
        // this.mongooseQuery
        //   .find().limit(5)
        //   .clone();
        //   this.totalCount = 5
      }
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
    await this.#category();
    return this;
  }

  async getByArrOfIDs() {
    await this.#byArrOfIDs();
    this.#pagination();
    return this;
  }
}
