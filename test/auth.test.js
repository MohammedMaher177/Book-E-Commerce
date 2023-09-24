import chai, { expect } from "chai";
import * as authController from "../src/modules/auth/controller/auth.controller.js";
import chaiHttp from "chai-http";
import { describe } from "mocha";
import UserModel from "../DB/models/user.model.js";
import Sinon from "sinon";
import mongoose from "mongoose";

// chai.should();
// chai.use(chaiHttp);

// describe("sign up API", () => {
//   before(function (done) {
//     mongoose.connect(process.env.TEST_DB).then((result) => {
//       done();
//     });
//   });

//   //   it("status code should be 409 if user  found", function (done) {
//   //     UserModel.create({
//   //       email: "test@test.com",
//   //       userName: "alaa",
//   //       password: "123456789Me@",
//   //     });
//   //     const req = {
//   //       body: {
//   //         email: "test@test.com",
//   //         userName: "alaa",
//   //         password: "123456789Me@",
//   //         rePassword: "123456789Me@",
//   //       },
//   //     };
//   //     const res = {
//   //       statusCode: 409,
//   //       message: null,
//   //       status: function (code) {
//   //         this.statusCode = code;
//   //         console.log(this);
//   //         return this;
//   //       },
//   //       json: function (data) {
//   //         console.log(data);
//   //         this.message = data.message;
//   //       },
//   //     };
//   //     authController.signup(req, res, () => {})
//   //       .then(() => {
//   //         console.log("this is res", res);
//   //         expect(res.statusCode).to.be.equal(409);
//   //         // expect(res.message).to.be.equal('success');
//   //         done();
//   //       })
//   //       .catch(done);
//   //   });

//   it("status code should be 201 if user not found", function (done) {
//     const req = {
//       body: {
//         email: "mohamed.elsayed.1.3.1999@gmail.com",
//         userName: "Mohamed",
//         password: "123456789Me@",
//         rePassword: "123456789Me@",
//       },
//     };
//     const res = {
//       statusCode: 500,
//       message: null,
//       status: function (code) {
//         console.log(code);
//         this.statusCode = code;
//         console.log("from status fn: ", this);
//         return this;
//       },
//       json: function (data) {
//         console.log(data);
//         this.message = data.message;
//       },
//     };
//     authController
//       .signup(req, res, () => {})
//       .then(() => {
//           expect(res.statusCode).to.be.equal(201);
//           expect(res.message).to.be.equal("success");
//           console.log("response: " , res);
//           done();
//       });
//   });

//   after(function (done) {
//     UserModel.deleteMany({})
//       .then(() => {
//         return mongoose.disconnect();
//       })
//       .then(() => {
//         done();
//       });
//   });
// });
// // describe("resend varyfy email API", () => {
// //     beforeEach(function () {});
// //     afterEach(function () {});
// //     it("status code should be 403 if user not found", function (done) {
// //       const req={} ;
// //       const res = {
// //         statusCode: 403,
// //         message: null,
// //         status: function (code) {
// //           this.statusCode = code;
// //           console.log(this);
// //           return this;
// //         },
// //         json: function (data) {
// //           console.log(data);
// //           this.message = data.message;
// //         },
// //       };
// //       authController.resendVaryfyEmail(req, res, () => {})
// //         .then(() => {
// //           expect(res.statusCode).to.be.equal(403);
// //           done();
// //         })
// //         .catch(done);
// //     });

// //     it("status code should be 202 if user found", function (done) {
// //         UserModel.create({
// //             email: "alaaosama2121998@gmail.com",
// //             userName: "alaa",
// //             password: "123456789Me@",
// //           });
// //         const req = {
// //         body: {
// //           email: "alaaosama2121998@gmail.com",
// //           userName: "alaa",
// //           password: "123456789Me@",
// //           rePassword: "123456789Me@",
// //         },
// //       };
// //       const res = {
// //         statusCode: 202,
// //         message: null,
// //         status: function (code) {
// //           this.statusCode = code;
// //           console.log(this);
// //           return this;
// //         },
// //         json: function (data) {
// //           console.log(data);
// //           this.message = data.message;
// //         },
// //       };
// //       authController.signup(req, res, () => {})
// //         .then(() => {
// //           console.log("this is res", res);
// //           expect(res.statusCode).to.be.equal(202);
// //           expect(res.json).have.property(message);
// //           done();
// //         })
// //         .catch(done);
// //     });
// //   });

describe("Auth Controller", function () {
  before(function (done) {
    mongoose
      .connect(
        "mongodb+srv://Book-E-Commerce:Book-E-Commerce@atlascluster.7mr3zao.mongodb.net/test-db"
      )
      .then((result) => {
        console.log("DB-Connected");
        // done()
      });
  });

  beforeEach(function () {});

  afterEach(function () {});

  // it('should throw an error with code 500 if accessing the database fails', function(done) {
  //   sinon.stub(User, 'findOne');
  //   User.findOne.throws();

  //   const req = {
  //     body: {
  //       email: 'test@test.com',
  //       password: 'tester'
  //     }
  //   };

  //   AuthController.login(req, {}, () => {}).then(result => {
  //     expect(result).to.be.an('error');
  //     expect(result).to.have.property('statusCode', 500);
  //     done();
  //   });

  //   User.findOne.restore();
  // });

  it("should send a response with a valid user status for an existing user", async (done) => {
    const req = {
      body: {
        email: "mohamed.elsayed.1.3.1999@gmail.com",
        userName: "Mohamed",
        password: "123456789Me@",
        rePassword: "123456789Me@",
      },
    };

    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.message;
      },
    };
    try{

        const result = await authController.signup(req, res, () => {})
          expect(result.statusCode).to.be.equal(201);
          expect(result.userStatus).to.be.equal("success");
          
    }catch(err){
        console.log(err);
    }
    
  });

  after(function (done) {
    UserModel.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
