const { body, validationResult} = require('express-validator');
const { response } = require('express');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllReservation = async (req, res) => {
    const result = await mongodb.getdataBase().db().collection('reservations').find();
    result.toArray().then((reservations) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(reservations);
    })
}

const getSingleReservation = async (req, res) => {
    const reservationId = new ObjectId(req,params.id);
    try{
        const reservationData = await mongodb.getdataBase().db().collection('reservations').findOne({ _id: reservationId } );
        if(reservationData){
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(reservationData);
        }else{
            res.status(404).json({ message: 'Reservation not found' });
        }
    }catch{
        res.status(404).json({error: 'Reservation not found'});
    }
}

const createReservation =[
    body('name').notEmpty().withMessage('Name is required'),
    body('reservationDate').notEmpty().withMessage('Date is required').isDate({format: 'YYYY-MM-DD'}).withMessage('date is incorrect YYYY-MM-DD'),
    body('numberOfPeople').isInt({min: 1}).withMessage('Number of people is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((error) => error.msg);
            return res.status(400).json({errors : errorMessages});
        }
        const reservations = {
            name: req.body.name,
            reservationDate: req.body.reservationDate,
            numberOfPeople: req.body.numberOfPeople,
            notes: req.body.notes
        }
        try{
            const result = await mongodb.getdataBase().db().collection('reservations').insertOne(reservations);
            res.status(201).json({id: result.insertedId})
        }catch(error){
            res.status(500).json({error: 'Error creating reservation'});
        }
    }
]

const updateReservation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('reservationDate').notEmpty().withMessage('Date is required').isDate({format: 'YYYY-MM-DD'}),
    body('numberOfPeople').isInt({min: 1}).withMessage('Number of people is require'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((error) => error.msg);
            return res.status(400).json({ errors : errorMessages });
        }
        const reservationId = new ObjectId(req.params.id);
        const reservations = {
            name: req.body.name,
            reservationDate: req.body.reservationDate,
            numberOfPeople: req.body.numberOfPeople,
            notes: req.body.notes
        }
        try{
            const result = await mongodb.getdataBase().db().collection('reservations').replaceOne({_id: reservationId}, reservations);
            if(result.modifiedCount > 0){
                res.status(200).send();
            }else{
                res.status(500).json(result.error || '2Error updating reservation');
            }
        }catch (error){
            res.status(500).json({error: '1Error updating reservation'});
        }
    }
]

const deleteReservation = async (req, res) => {
    const reservationId = new ObjectId(req.params.id);
    try{
        const result = await mongodb.getdataBase().db().collection('reservations').deleteOne({_id : reservationId});
        if(result.deletedCount > 0){
            res.status(200).send();
        }else{
            res.status(500).json(result.error || 'Error deleting reservation');
        }
    }catch{
        res.status(500).json({error: 'Error deleting reservation'});
    }
}

module.exports = { getAllReservation, getSingleReservation, createReservation, updateReservation, deleteReservation };