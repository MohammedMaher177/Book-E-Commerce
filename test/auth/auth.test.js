import { expect } from "chai";
import { afterEach, describe } from "mocha";
import UserModel from "../../DB/models/user.model.js";
import mongoose from "mongoose";
import { catchError } from "../../src/util/ErrorHandler/catchError.js";
import { forgetPassword, refresh, resendCode, resetePassword, signin, signinWithToken, signup, varifyPasswordEmail, verifyEmail } from "../../src/modules/auth/controller/auth.controller.js";
import Jwt from "jsonwebtoken";
import Token from "../../DB/models/token.model.js";

describe("Auth Controllers", () => {

  describe("signup controller", () => {

    before(async () => {
      await mongoose.connect("mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/test-db")
      console.log("DB Connected");
    });

    it("should have a success message with status code 201 if user created successfully", async () => {
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

      await catchError(signup)(req, res, () => { })
      expect(res.statusCode).to.be.equal(201);
      expect(res.message).to.be.equal("success");

    })

    it("should return an error with message 'email already exist' with status code 409 if user already exist", async () => {
      const req = {
        body: {
          email: "mohamed.elsayed.1.3.1999@gmail.com"
        }
      };
      const next = (err) => {
        expect(err.message).to.be.equal('Email Already Exist')
        expect(err.statusCode).to.be.equal(409)
      }
      await catchError(signup)(req, null, next)
    })

    after(async () => {
      await UserModel.deleteMany();
      await mongoose.disconnect();
    })

  });

  describe('signin controller', () => {

    before(async () => {
      await mongoose.connect("mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/test-db")
      await UserModel.create({
        email: "mohamed.elsayed.1.3.1999@gmail.com",
        userName: "Mohamed",
        password: "123456789Me@",
        rePassword: "123456789Me@",
      })
    })

    it("should return status code of 201 with token and success message if user is already exist", async () => {

      const req = {
        body: {
          email: "mohamed.elsayed.1.3.1999@gmail.com",
          password: "123456789Me@",
        }
      };
      const res = {
        statusCode: 500,
        message: null,
        token: null,
        headers: {},
        cookie: function (name, value, options) {
          this.headers[name] = value;
        },
        status: function (code) {
          this.statusCode = code;
          return this
        },
        json: function (data) {
          this.message = data.message;
          this.token = data.token;
        }
      }
      const next = () => { };

      await catchError(signin)(req, res, next);
      expect(res).to.have.property('statusCode', 201);
      expect(res).to.have.property('message', "success");
      expect(res.token).to.not.be.null;
      expect(res.headers).to.have.property('refreshToken');
    })

    it("should return error with message 'this email doesn't exist' and status code 404 if email is not exist in", async () => {
      const req = {
        body: {
          email: "mohamed.elsayed.1.3.19@gmail.com",
          password: "123456789Me@",
        }
      }
      const next = (err) => {
        expect(err.message).to.be.equal("this email doesn't exist")
        expect(err.statusCode).to.be.equal(404)
      }

      await catchError(signin)(req, null, next)
    })

    it("should return error with message 'invalid password' and status code 401 if password is not correct", async () => {
      const req = {
        body: {
          email: "mohamed.elsayed.1.3.1999@gmail.com",
          password: "123456789Me",
        }
      }
      const next = (err) => {
        expect(err.message).to.be.equal("invalid password")
        expect(err.statusCode).to.be.equal(401)
      }

      await catchError(signin)(req, null, next)
    })

    after(async () => {
      await UserModel.deleteMany();
      await mongoose.disconnect();
    })

  });

  describe("resendCode controller", () => {

    let user;
    before(async () => {
      await mongoose.connect("mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/test-db")
      user = await UserModel.create({
        email: "mohamed.elsayed.1.3.1999@gmail.com",
        userName: "Mohamed",
        password: "123456789Me@",
        rePassword: "123456789Me@",
      })
    })

    it("should send a success message and status 202 if there is a user and his/her status is not confirmed", async () => {

      const req = {
        user,
      }
      const res = {
        statusCode: 500,
        message: null,
        status: function (code) {
          this.statusCode = code;
          return this
        },
        json: function (data) {
          this.message = data.message;
        }
      };
      const next = () => { };

      await catchError(resendCode)(req, res, next);
      expect(res.statusCode).to.be.equal(202);
      expect(res.message).to.be.equal('success');
    })

    it("should send a success message and status 202 if there is a user and his/her status is reseting password", async () => {
      user.status = 'reseting password';
      const req = {
        user,
      }
      const res = {
        statusCode: 500,
        message: null,
        status: function (code) {
          this.statusCode = code;
          return this
        },
        json: function (data) {
          this.message = data.message;
        }
      };
      const next = () => { };

      await catchError(resendCode)(req, res, next);
      expect(res.statusCode).to.be.equal(202);
      expect(res.message).to.be.equal('success');
    })

    // it("should send a error message with 'this email is either confirmed or diactivated' and status 401 if there is a user and his/her status is not equal to 'not confirmed' or 'reseting password'", async () => {

    //   user.status = 'active';
    //   const req = {
    //     user,
    //   }

    //   const next = (err) => {
    //     expect(err).to.have.property('statusCode', 401);
    //     expect(err).to.have.property('message', 'this email is either confirmed or diactivated')
    //   };

    //   await catchError(resendCode)(req, null, next);
    // })

    after(async () => {
      await UserModel.deleteMany();
      await mongoose.disconnect();
    })

  });

  describe("refresh controller", () => {

    let token
    before(async () => {
      await mongoose.connect("mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/test-db")
      const user = await UserModel.create({
        email: "mohamed.elsayed.1.3.1999@gmail.com",
        userName: "Mohamed",
        password: "123456789Me@",
        rePassword: "123456789Me@",
      })

      token = Jwt.sign({
        id: user._id,
        role: user.role
      }, process.env.REFRESHTOKEN_SECRET);

      const expiredAt = new Date();
      expiredAt.setHours(expiredAt.getHours() + 2);

      await Token.create({
        userId: user._id,
        token,
        expiredAt
      })
    });

    it("should throw an error if refreshToken is not standerd with message 'jwt malformed'", async () => {

      const req = {
        cookies: {
          refreshToken: "xyz"
        }
      }
      const next = (err) => {
        expect(err.message).to.be.equal('jwt malformed');
      }

      await catchError(refresh)(req, null, next)
    })

    it("should return success message and new token with code 201", async () => {

      const req = {
        cookies: {
          refreshToken: token
        }
      }
      const res = {
        statusCode: 500,
        message: null,
        token: null,
        status: function (code) {
          this.statusCode = code
          return this
        },
        json: function (data) {
          this.message = data.message;
          this.token = data.token
        }
      }
      const next = () => { }

      await catchError(refresh)(req, res, next)
      expect(res).to.have.property('statusCode', 201);
      expect(res).to.have.property('message', 'success');
      expect(res.token).to.not.be.null;
    })

    after(async () => {
      await UserModel.deleteMany();
      await mongoose.disconnect();
    })

  })

  describe("verify email controller", () => {

    let user;
    before(async () => {
      await mongoose.connect("mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/test-db")
      user = await UserModel.create({
        email: "mohamed.elsayed.1.3.1999@gmail.com",
        userName: "Mohamed",
        password: "123456789Me@",
        rePassword: "123456789Me@",
      })
    })

    it("should return error message with 'In-Valid Verify Code' and code 401 if resived code is not equal to sent code and code is expired more than (600000 ms)", async () => {

      user.virefyCode = {
        date: 200000,
        code: 'fg537'
      }
      const req = {
        user,
        body: {
          code: 'fg537',
        }
      }
      const next = (err) => {
        expect(err.statusCode).to.be.equal(401)
        expect(err.message).to.be.equal('In-Valid Verify Code')
      }

      await catchError(verifyEmail)(req, null, next)
    })

    it("should return success message and code 202 if resived code is equal to sent code and code is not expired less than or eq (600000 ms)", async () => {

      user.virefyCode = {
        date: Date.now(),
        code: 'fg537'
      }
      const req = {
        user,
        body: {
          code: 'fg537',
        }
      }
      const res = {
        statusCode: 500,
        message: null,
        token: null,
        headers: {},
        cookie: function (name, value, options) {
          this.headers[name] = value;
        },
        status: function (code) {
          this.statusCode = code;
          return this
        },
        json: function (data) {
          this.message = data.message;
          this.token = data.token
        }
      }
      const next = () => { }

      await catchError(verifyEmail)(req, res, next)
      expect(res.statusCode).to.be.equal(202);
      expect(res.token).to.not.be.null;
      expect(res.message).to.be.equal('success');
    })

    after(async () => {
      await UserModel.deleteMany();
      await mongoose.disconnect();
    })

  })

  describe("forget Password controller", () => {

    before(async () => {
      await mongoose.connect("mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/test-db")
      await UserModel.create({
        email: "mohamed.elsayed.1.3.1999@gmail.com",
        userName: "Mohamed",
        password: "123456789Me@",
        rePassword: "123456789Me@",
      })
    })

    it("should return error message with 'This email does not exsist' and code 404 if enterd email is not registerd", async () => {

      const req = {
        body: {
          email: "mohamed.elsayed.1.3.199@gmail.com",
        }
      }
      const next = (err) => {
        expect(err.statusCode).to.be.equal(404)
        expect(err.message).to.be.equal('This email does not exsist')
      }

      await catchError(forgetPassword)(req, null, next)
    })

    it("should return success message and code 202 if enterd email is registerd", async () => {

      const req = {
        body: {
          email: "mohamed.elsayed.1.3.1999@gmail.com",
        }
      }
      const res = {
        statusCode: 500,
        message: null,
        token: null,
        status: function (code) {
          this.statusCode = code;
          return this
        },
        json: function (data) {
          this.message = data.message;
          this.token = data.token
        }
      }
      const next = () => { }

      await catchError(forgetPassword)(req, res, next)
      expect(res.statusCode).to.be.equal(202);
      expect(res.token).to.not.be.null;
      expect(res.message).to.be.equal('success');
    })

    after(async () => {
      await UserModel.deleteMany();
      await mongoose.disconnect();
    })

  })

  describe("verifypassword email controller", () => {

    let user;
    before(async () => {
      await mongoose.connect("mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/test-db")
      user = await UserModel.create({
        email: "mohamed.elsayed.1.3.1999@gmail.com",
        userName: "Mohamed",
        password: "123456789Me@",
        rePassword: "123456789Me@",
      })
    })

    it("should return error message with 'In-Valid Verify Code' and code 401 if resived code is not equal to sent code and code is expired more than (600000 ms)", async () => {

      user.virefyCode = {
        date: 200000,
        code: 'fg537'
      }
      const req = {
        user,
        body: {
          code: 'fg537',
        }
      }
      const next = (err) => {
        expect(err.statusCode).to.be.equal(403)
        expect(err.message).to.be.equal('In-Valid Verify Code')
      }

      await catchError(varifyPasswordEmail)(req, null, next)
    })

    it("should return success message and code 202 if resived code is equal to sent code and code is not expired less than or eq (600000 ms)", async () => {

      user.virefyCode = {
        date: Date.now(),
        code: 'fg537'
      }
      const req = {
        user,
        body: {
          code: 'fg537',
        }
      }
      const res = {
        statusCode: 500,
        message: null,
        status: function (code) {
          this.statusCode = code;
          return this
        },
        json: function (data) {
          this.message = data.message;
          this.token = data.token
        }
      }
      const next = () => { }

      await catchError(varifyPasswordEmail)(req, res, next)
      expect(res.statusCode).to.be.equal(202);
      expect(res.message).to.be.equal('success');
    })

    after(async () => {
      await UserModel.deleteMany();
      await mongoose.disconnect();
    })

  })

  describe("resete password controller", () => {

    let user;
    before(async () => {
      await mongoose.connect("mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/test-db")
      user = await UserModel.create({
        email: "mohamed.elsayed.1.3.1999@gmail.com",
        userName: "Mohamed",
        password: "123456789Me@",
        rePassword: "123456789Me@",
      })
    })


    it("should return success message and code 202 if req has user and password in req body", async () => {

      const req = {
        user,
        body: {
          password: '96312587Me@',
        }
      }
      const res = {
        statusCode: 500,
        message: null,
        status: function (code) {
          this.statusCode = code;
          return this
        },
        json: function (data) {
          this.message = data.message;
        }
      }
      const next = () => { }

      await catchError(resetePassword)(req, res, next)
      expect(res.statusCode).to.be.equal(202);
      expect(res.message).to.be.equal('success');
    })

    after(async () => {
      await UserModel.deleteMany();
      await mongoose.disconnect();
    })

  })

  describe('signin with token controller', () => {

    let token
    before(async () => {
      await mongoose.connect("mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/test-db")
      const user = await UserModel.create({
        email: "mohamed.elsayed.1.3.1999@gmail.com",
        userName: "Mohamed",
        password: "123456789Me@",
        rePassword: "123456789Me@",
      })

      token = Jwt.sign({
        id: user._id.toString(),
        role: user.role
      }, process.env.TOKEN_SECRET);
    })

    it("should return error message with 'jwt malformed' if token is not valid", async () => {

      const req = {
        params: {
          token: "mohamed.elsayed.1.3.1999@gmail.com",
        }
      };
      const next = (err) => {
        expect(err.message).to.be.equal("jwt malformed")
      }

      await catchError(signinWithToken)(req, null, next)
    })

    it("should return status code of 404 with error message if there is no user id saved in token", async () => {

      const token = Jwt.sign({
        id: "650ee73fe10e88fff6e1d4bc",
        role: 'User'
      }, process.env.TOKEN_SECRET);


      const req = {
        params: {
          token,
        }
      };
      const next = (err) => {
        expect(err.message).to.be.equal("This user does not exist")
        expect(err.statusCode).to.be.equal(404)
      }

      await catchError(signinWithToken)(req, null, next)
    })

    it("should return status code of 201 with success message and token if there user id saved in token", async () => {

      const req = {
        params: {
          token,
        }
      };
      const res = {
        statusCode: 500,
        message: null,
        token: null,
        headers: {},
        cookie: function (name, value, options) {
          this.headers[name] = value;
        },
        status: function (code) {
          this.statusCode = code;
          return this
        },
        json: function (data) {
          this.message = data.message,
            this.token = data.token
        }
      }
      const next = () => {}

      await catchError(signinWithToken)(req, res, next)

      expect(res.message).to.be.equal("success")
      expect(res.statusCode).to.be.equal(201)
      expect(res.token).to.not.be.null
    })

    after(async () => {
      await UserModel.deleteMany();
      await mongoose.disconnect();
    })

  });

})