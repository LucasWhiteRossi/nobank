const router = require("express").Router();
const UserModel = require("../models/User.model");
const AccountModel = require("../models/Account.model");

const isAuth = require('../middlewares/isAuth')
const attachCurrentUser = require('../middlewares/attachCurrentUser');


router.post('/add-account', isAuth, attachCurrentUser, async (req, res) => {
    try{
        const newAccount = await AccountModel.create({
            ...req.body,
            owner: req.currentUser._id
        })

        await UserModel.findOneAndUpdate(
            {_id: req.currentUser._id},
            {$push: { accounts: newAccount._id } },
            {runValidators: true, new: true}
        );

        return res.status(201).json(newAccount);

    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
});

router.post('/deactivate-account/:accountId', isAuth, attachCurrentUser, async (req, res) => {
    try{
        const {accountId} = req.params.accountId
        const deactivateAccount = AccountModel.findOneAndUpdate(
            {_id: accountId,
            owner: req.currentUser._id},
            {isActive: false,
            disabledOn: Date.now()},
            {runValidators:true, new:true}
        );
    return res.status(202).json(deactivateAccount)

    }catch(err){
        console.log(err)
        return res.status(304).json(err)
    }

});


router.get('/accounts', isAuth, attachCurrentUser, async (req, res) => {
    try{

        const accounts = await AccountModel.find({
            owner: req.currentUser._id 
        })
        return res.status(200).json(accounts);

    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }

});

router.get('/account/:accountId', isAuth, attachCurrentUser, async (req, res) => {
    try{
        const accountId = req.params.accountId
        const account = await AccountModel.findOne({
            _id: accountId,
            owner: req.currentUser._id
        })
        return res.status(200).json(account);

    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
});

router.get('/account/:accountId', isAuth, attachCurrentUser, async (req, res) => {
    try{
        const { accountId } = req.params.accountId
        const account = await AccountModel.findOne({
            _id: accountId,
            owner: req.currentUser._id
        })
        return res.status(200).json(accounts);

    }catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
});

module.exports = router;