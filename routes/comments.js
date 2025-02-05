const router = require('express').Router();
const commentsController = require('../controller/comments')

router.get('/', commentsController.getAllCommets);
router.get('/:id', commentsController.getSingleComments);
router.post('/', commentsController.createComment);
router.put('/:id', commentsController.updateComment);
router.delete('/:id', commentsController.deleteComment);

module.exports = router;