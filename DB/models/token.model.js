
import mongoose, { Schema, Types, model } from "mongoose";

const schema = new Schema({
    userId: {type: Types.ObjectId, required: true, ref: 'User'},
    token: {type: String, required: true},
    createdAt: {type: Date, default: new Date()},
    expiredAt: {type: Date, required: true}
})

const Token = mongoose.model('Token', schema);

export default Token;