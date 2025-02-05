const { body, validationResult} = require('express-validator');
const { response } = require('express');
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllCommets = async (req, res) => {
    const result = await mongodb.getdataBase().db().collection('comments').find();
    result.toArray().then((comments) => {
        res.setHeader('Content-type', 'application/json');
        res.status(200).json(comments);
    })
}

const getSingleComments = async (req, res) => {
    const commentId = new ObjectId(req.params.id);
    try{
        const commentData = await mongodb.getdataBase().db().collection('comments').findOne({ _id: commentId });
        if (commentData) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(commentData);
        } else {
        res.status(404).json({ error: 'Comment  not found' });
        }
    }catch{
        res.status(500).json({ error: ' Error fetching comment' });
    }
}

const createComment =[
    body('name').notEmpty().withMessage('Name is required'),
    body('rating').isInt({min : 1}).withMessage('Rating must be an integer'),
    body('comment').notEmpty().withMessage('Comment is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((error) => error.msg);
            return res.status(400).json({errors : errorMessages});
        }
        const comment ={
            name: req.body.name,
            rating: req.body.rating,
            comment: req.body.comment
        }
        try{
            const response = await mongodb.getdataBase().db().collection('comments').insertOne(comment);
            res.status(201).json({id: response.insertedId});
        }catch(error){
            res.status(500).json({error: 'Error creating comment' });
        }
        
    }
]

const updateComment = [
    body('name').notEmpty().withMessage('Name is required'),
    body('rating').isInt({min : 1}).withMessage('Rating must be an integer'),
    body('comment').notEmpty().withMessage('Comment is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
    const commentId = new ObjectId(req.params.id);
    const comment = {
        name: req.body.name,
        rating: req.body.rating,
        comment: req.body.comment
        }
        try {
            const response = await mongodb.getdataBase().db().collection('comments').replaceOne({ _id: commentId }, comment);
            if(response.modifiedCount > 0){
                res.status(200).send();
            }else{
                res.status(500).json(response.error || '2Error updating comment')
            }
        }catch(error){
            res.status(500).json({error: '1Error updating comment' });
        }
    }
]

const deleteComment = async (req, res) => {
    const commentId = new ObjectId(req.params.id);
    try{
        const response = await mongodb.getdataBase().db().collection('comments').deleteOne({ _id: commentId });
        if(response.deletedCount > 0){
            res.status(204).send();
        }else{
            res.status(500).json(response.error || 'Error deleting comment')
        }
    }catch(error){
        res.status(500).json({error: 'Error deleting comment' });
    }
}

module.exports = { getAllCommets, getSingleComments, createComment, updateComment, deleteComment };