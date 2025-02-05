const { body, validationResult } = require('express-validator');
const {response} = require('express');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId

const getAllUsers = async (req, res) =>{
    const result = await mongodb.getdataBase().db().collection('user').find();
    result.toArray().then((user) => {
        res.setHeader('Content-type', 'application/json');
        res.status(200).json(user);
    })
}

const getSingleUsers = async (req, res) =>{
    const userId = new ObjectId(req.params.id);
    try{
        const userData = await mongodb.getdataBase().db().collection('user').findOne({ _id: userId });
        if (userData) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(userData);
            } else {
                res.status(404).json({ message: 'User not found' });
        }
    }catch{
        res.status(500).json({ message: 'Error fetching user' });
    }
}

const createUser = [
    body('name').notEmpty().withMessage('Name is require'),
    body('lastname').notEmpty().withMessage('Last name is require'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('phone').isInt({min : 1}).withMessage('Number of people is invalid'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((error) => error.msg);
            return res.status(400).json({errors : errorMessages});
        }
        const user = {
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone
        }
        try{
            const response = await mongodb.getdataBase().db().collection('user').insertOne(user);
            res.status(201).json({id: response.insertId});
        }catch{
            res.status(500).json({ message: 'Error creating user' });
        }
    }
];

const Updateuser = [
    body('name').notEmpty().withMessage('Name is require'),
    body('lastname').notEmpty().withMessage('Last name is require'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('phone').isInt({min : 1}).withMessage('Number of people is invalid'),

    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({errorMessages});
        }
    
        const userId = new ObjectId(req.params.id);
        const user = {
            name: req.body.name,
            lastname : req.body.lastname,
            email: req.body.email,
            phone: req.body.phone
        }
        try{
            const response = await mongodb.getdataBase().db().collection('user').replaceOne({ _id: userId }, user);
            if(response.modifiedCount > 0){
                res.status(200).send();
            }else{
                res.status(500).json(response.error || 'Error Updating user');
            }
        }catch{
            res.status(500).json({ message: 'Error updating user' });
        }
    }
];

const deleteUser = async (req, res) => {
    const userId = new ObjectId(req.params.id);
    try{
        const response = await mongodb.getdataBase().db().collection('user').deleteOne({ _id: userId });
        if(response.deletedCount > 0){
            res.status(200).send();
        }else{
            res.status(500).json(response.error || 'Error deleting user');
        }
    }catch{
        res.status(500).json({ message: 'Error deleting user' });
    }
}

module.exports = {getAllUsers, getSingleUsers, createUser, Updateuser, deleteUser};