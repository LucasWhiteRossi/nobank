const router = require("express").Router();
const UserModel = require("../models/User.model");
const AccountModel = require("../models/Account.model");
const TransactionModel = require("../models/Transaction.model");

const isAuth = require('../middlewares/isAuth')
const attachCurrentUser = require('../middlewares/attachCurrentUser');

//resgatar transações feitas
router.get("/transactions-made/:idAccount", isAuth, attachCurrentUser, async (req, res)=>{
    try{
        const madeTransactions = await TransactionModel.find({originAccount: req.currentUser._id})
        return res.status(200).json(madeTransactions)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg:err})   
    }
    
})

//resgatar transações recebidas
router.get("/transactions-received/:idAccount", isAuth, attachCurrentUser, async (req, res)=>{
    try{
        const madeTransactions = await TransactionModel.find({targetAccount: req.currentUser._id})
        return res.status(200).json(madeTransactions)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg:err})   
    }
})


//fazer transações
router.post("/new-transaction/:idOriginAccount/:idTargetAccount", isAuth, attachCurrentUser, async (req, res)=>{
    try{
        const targetAccount = req.params.idTargetAccount
        const originAccount = req.params.idOriginAccount

        const targetAccountObject = await AccountModel.findOne({_id: targetAccount})
        if (!targetAccountObject._id){
            throw 'the target account does not exist or is not available'
        }
        const originAccountObject = await AccountModel.findOne({_id: originAccount})
        if (!originAccountObject._id){
            throw 'the origin account does not exist or is not available'
        } 
        
        const newTransaction = await TransactionModel.create(
            {...req.body,
                targetAccount: targetAccount,
                originAccount: originAccount
            })
        
        // atualizar conta logada
        await AccountModel.findOneAndUpdate(
            {_id:originAccount},
            {$set: {balance: originAccountObject.balance-newTransaction.value},
            $push: {transactions: originAccountObject._id}
        },
            {runValidators:true, new:true}
        )
        
        // atualizar conta alvo
        await AccountModel.findOneAndUpdate(
            {_id:targetAccount},
            {$set: {balance: targetAccountObject.balance + newTransaction.value},
            $push: {transactions: originAccountObject._id}},
            {runValidators:true, new:true}
        )
        
        return res.status(201).json(newTransaction)
    
    }catch(err){
        console.log(err)
        return res.status(500).json({msg:err})
    }
});

module.exports = router;