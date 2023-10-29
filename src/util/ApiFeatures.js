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
    console.log(this.totalCount);
    return this;
  }

  async #filter() {
    let filterObj = { ...this.queryString };
    const delObj = ["page", "sort", "fields", "keyword"];
    delObj.forEach((ele) => {
      delete filterObj[ele];
    });
   
    let val;
    let reg = [];
    if (filterObj["price"]) {
      let ele = filterObj["price"];
      ele = JSON.stringify(ele);
      val = ele.split("-");
      val[0] = Number(val[0].replace(/["]/g, (match) => (match = "")));
      val[1] = Number(val[1].replace(/["]/g, (match) => (match = "")));
      ele = { price: {"$gte":val[0],"$lte":val[1]} };
      console.log(ele);
      reg.push(ele);
    }
    if (filterObj["published"]) {
      let ele = filterObj["published"];
      ele = JSON.stringify(ele);
      val = ele.split("-");
      val[0] = Number(val[0].replace(/["]/g, (match) => (match = "")));
      val[1] = Number(val[1].replace(/["]/g, (match) => (match = "")));
      ele = { published: {"$gte":val[0],"$lte":val[1]} };
      console.log(ele);
      reg.push(ele);
    }
    if (filterObj["author"]) {
      console.log(filterObj["author"]);
      let key = filterObj["author"].split(",");
      key.map((el) => el.replace(/[^\w\s]/gi, (match) => `\\${match}`));
      const options = key.map((el) => {
        el = { author: { $regex: el, $options: "i" } };
        reg.push(el);
      });
    }
    if (filterObj["category"]) {
      let key = filterObj["category"].split(",");
      // category by name 
      // key.map((el) => el.replace(/[^\w\s]/gi, (match) => `\\${match}`));
      // key = key.map((el) => el.replace(/[.]/gi, (match) => "&"));
      // key = key.map((el) => el.replace(/[@]/gi, (match) => ","));
      // console.log(key);
      // category by slug
      const options = key.map((el) => {
        return {
           slug: el,
        };
      });
      console.log(options);
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
      console.log("c : ",c);
      if (c.length > 0) {
        c.map((el)=>{

          reg.push(el);
        })
      }
    }
    if (filterObj["lang"]) {
      console.log(filterObj["lang"]);
      let key = filterObj["lang"].split(",");
      key.map((el) => el.replace(/[^\w\s]/gi, (match) => `\\${match}`));
      const options = key.map((el) => {
        el = { lang: { $regex: el, $options: "i" } };
        reg.push(el);
      });
    }
    if (filterObj["publisher"]) {
      console.log(filterObj["publisher"]);
      let key = filterObj["publisher"].split(",");
      key.map((el) => el.replace(/[^\w\s]/gi, (match) => `\\${match}`));
      const options = key.map((el) => {
        el = { publisher: { $regex: el, $options: "i" } };
        reg.push(el);
      });
    }
    if (filterObj["pages"]) {
      let ele = filterObj["pages"];
      ele = JSON.stringify(ele);
      val = ele.split("-");
      val[0] = Number(val[0].replace(/["]/g, (match) => (match = "")));
      val[1] = Number(val[1].replace(/["]/g, (match) => (match = "")));
      ele = { pages: {"$gte":val[0],"$lte":val[1]} };
      console.log(ele);
      reg.push(ele);
    }
    if (filterObj["format"]) {
      let ele = filterObj["format"];
      ele = { format: ele };
      console.log(ele);
      reg.push(ele);
    }
    if (filterObj["name"]) {
      console.log(filterObj["name"]);
      let key = filterObj["name"].split(",");
      key.map((el) => el.replace(/[^\w\s]/gi, (match) => `\\${match}`));
      const options = key.map((el) => {
        el = { name: { $regex: el, $options: "i" } };
        reg.push(el);
      });
    }
    console.log(filterObj);
    console.log("reg :  ", reg);
    if (Object.keys(filterObj).length==0) {
      this.totalCount = await  this.mongooseQuery.find().count().clone();
        this.mongooseQuery.find();
    }else{

    this.totalCount = await  this.mongooseQuery.find({ $or: reg }).count().clone();
        this.mongooseQuery.find({ $or: reg });
    }
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
      // console.log(key);
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
