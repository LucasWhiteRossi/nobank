const { Schema, model, default: mongoose } = require("mongoose");

const accountSchema = new Schema({
    owner:  {type: mongoose.Types.ObjectId, ref: "User", required:true},
    bankNum: {type: String, required:true, trim:true},
    agencyNum: {type: String, required:true, trim:true},
    accoutNum: {type: String, required:true, trim:true},
    balance: {type: Number, required: true},
    transactions: [{type: mongoose.Types.ObjectId, ref: "Transactions"}],
    isActive: { type: Boolean, default: true },
    disabledOn: { type: Date }
});

const AccountModel = model("Account", accountSchema);

module.exports = AccountModel;