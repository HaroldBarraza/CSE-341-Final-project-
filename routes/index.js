const passport = require('passport');

const router = require('express').Router();
router.use('/', require('./swagger'));
router.use('/user', require('./user'));
router.use('/comments', require('./comments'));
router.use('/reservations', require('./reservations'));
router.use('/tables', require('./tables'))

module.exports = router;