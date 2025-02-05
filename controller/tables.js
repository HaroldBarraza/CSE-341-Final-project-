const { body, validationResult} = require('express-validator');
const { response } = require('express');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllTables = async (req, res) =>{
    const result = await mongodb.getdataBase().db().collection('tables').find();
    result.toArray().then((tables) =>{
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(tables);
    })
}

const getSingleTables = async (req, res) =>{
    const tableId = new ObjectId(req.params.id);
    try{
        const result = await mongodb.getdataBase().db().collection('tables').findOne({ _id: tableId });
        if(result){
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        }else{
            res.status(404).json({message: 'Table not found'});
        }
    }catch{
        res.status(500).json({message: 'Error while fetching table'});
    }
}

const createTable = [
    body('tableNumber').isInt({min: 1}).withMessage('the table number not is correct'),
    body('capacity').isInt({min: 1}).withMessage('the table capacity'),
    body('location').notEmpty().withMessage('the table location is require'),
    body('status').notEmpty().withMessage('the table status is require'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors : errorMessages });
        }
        const tables = {
            tableNumber: req.body.tableNumber,
            capacity: req.body.capacity,
            location: req.body.location,
            status: req.body.status
        }
        try{
            const response = await mongodb.getdataBase().db().collection('tables').insertOne(tables);
            res.status(201).json({id: response.insertId});
        }catch(error){
            res.status(500).json({message: 'Error while creating table'});
        }
    }
]

const updateTable = [
    body('tableNumber').isInt({min: 1}).withMessage('the table number in invalid'),
    body('capacity').isInt({min: 1}).withMessage('the table capacity is invalid'),
    body('location').notEmpty().withMessage('the table location is required'),
    body('status').notEmpty().withMessage('the table status is required'),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors : errorMessages });
        }
        const tableId = new ObjectId(req.params.id);
        const tables = {
            tableNumber: req.body.tableNumber,
            capacity: req.body.capacity,
            location: req.body.location,
            status: req.body.status
        }
        try{
            const response = await mongodb.getdataBase().db().collection('tables').replaceOne({ _id: tableId }, tables);
            if(response.modifiedCount > 0){
                res.status(200).send();
            }else{
                res.status(500).json(response.error || 'Error while updating table');
            }
        }catch{
            res.status(500).json({message: 'Error while updating table'});
        }
    }
];

const deleteTable = async (req, res) => {
    const tableId = new ObjectId(req.params.id);
    try{
        const response = await mongodb.getdataBase().db().collection('tables').deleteOne({ _id: tableId });
        if(response.deletedCount > 0){
            res.status(204).send();
        }else{
            res.status(500).json(response.error || 'Error while deleting table');
        }
    }catch(error){
        res.status(500).json({message: 'Error while deleting table'});
    }
}

module.exports = { getAllTables, getSingleTables ,createTable, updateTable, deleteTable };