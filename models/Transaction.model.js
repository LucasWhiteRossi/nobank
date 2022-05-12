const { Schema, model, default: mongoose } = require("mongoose");

const transactionSchema = new Schema({
    targetAccount:  {type: mongoose.Types.ObjectId, ref: "Account", required:true},
    originAccount:  {type: mongoose.Types.ObjectId, ref: "Account", required:true},
    value: {type: Number, required: true},
    EventName: { type: String },
    EventDate: { type: Date , required: true, default: Date.now()}
});

const TransactionModel = model("Transaction", transactionSchema);

module.exports = TransactionModel;