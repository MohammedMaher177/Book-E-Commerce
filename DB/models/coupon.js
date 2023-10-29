import mongoose, { Schema, Types, model } from "mongoose";

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    max_use: {
        type: Number,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    used_by: [
        {
            type: Types.ObjectId,
            ref: "User",
        }
    ]
});

couponSchema.method('checkIfUsedByUser', function(user_id){
    const id = new Types.ObjectId(user_id);
    const isUsed = this.used_by.includes(id);
    return isUsed;
});

couponSchema.method('addToUsedBy', async function(user_id){
    const id = new Types.ObjectId(user_id);
    this.used_by.push(id);
    this.max_use--;
    await this.save();
});

couponSchema.method('decreaseMaxUse', async function(){
    this.max_use--;
    await this.save();
})

couponSchema.method('increaseMaxUse', async function(){
    this.max_use++;
    await this.save();
})

couponSchema.method('removeFromUsedBy', async function(user_id){
    const userID = new Types.ObjectId(user_id);
    const index = this.used_by.findIndex((ele) => ele.prototype.toString() === user_id);
    this.used_by.splice(index, 1);
    this.max_use++;
    await this.save();
});

couponSchema.static('findByCode', function(code) { 
    return this.find({ code })
});

const Coupon = model("coupon", couponSchema);

export default Coupon;

