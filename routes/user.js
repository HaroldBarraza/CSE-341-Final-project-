const router = require('express').Router();
const userController = require('../controller/user')

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getSingleUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.Updateuser);
router.delete('/:id', userController.deleteUser);

module.exports = router;