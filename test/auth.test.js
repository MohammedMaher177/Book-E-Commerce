import { expect } from "chai";
import * as authController from "../src/modules/auth/controller/auth.controller.js";
import { describe } from "mocha";
import UserModel from "../DB/models/user.model.js";
import mongoose from "mongoose";


describe("Auth Controllers", function () {
  describe("signup controller", function () {

    before(async function () {
      await mongoose.connect("mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/test-db")
      console.log("DB connection established");
    });

    it("should have a success message with status code 201 if user created successfully", async function () {
      const req = {
        body: {
          email: "mohamed.elsayed.1.3.1999@gmail.com",
          userName: "Mohamed",
          password: "123456789Me@",
          rePassword: "123456789Me@",
        }
      };

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

      const result = await authController.signup(req, res, () => { });
      console.log(result);
      console.log(res);
      expect(res.statusCode).to.be.equal(201);
      expect(res.body).to.be.equal("success");

    })

    after(async function () {
      await UserModel.deleteMany();
      await mongoose.disconnect();
    })

  })
})