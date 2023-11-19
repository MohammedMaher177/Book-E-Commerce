
import mongoose from "mongoose";
import { expect } from "chai";
import categoryModel from "../../DB/models/category.model.js";
import { catchError } from "../../src/util/ErrorHandler/catchError.js";
import { after, before, describe } from "mocha";
import { getData } from "../../src/util/model.util.js";

describe("Category controllers", () => {
    describe("getall contoller", ()=>{
        before(async () => {
            await mongoose.connect("mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/test-db")
            console.log("DB Connected");
          });

          it("should have a success message with status code 200 ", async () => {
      
            const res = {
              statusCode: 500,
              message: null,
              status: function (code) {
                this.statusCode = code;
                return this;
              },
              json: function (data) {
                this.message = data.message;
              }
            };
            await catchError(getData(categoryModel))
            expect(res.statusCode).to.be.equal(200);
            expect(res.message).to.be.equal("success");
      
          })

          after(async () => {
            await categoryModel.deleteMany();
            await mongoose.disconnect();
          })
    })
})