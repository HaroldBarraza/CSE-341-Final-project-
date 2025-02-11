const router = require('express').Router();
const commentsController = require('../controller/comments')
const { authenticate } = require('../middleware/Auth')

router.get('/', commentsController.getAllCommets);
router.get('/:id', commentsController.getSingleComments);
router.use(authenticate)
router.post('/', commentsController.createComment);
router.put('/:id', commentsController.updateComment);
router.delete('/:id', commentsController.deleteComment);

module.exports = router;