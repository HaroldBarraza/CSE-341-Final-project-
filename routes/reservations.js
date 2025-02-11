const router = require('express').Router();
const reservationsController = require('../controller/reservations')
const { authenticate } = require('../middleware/Auth')

router.get('/', reservationsController.getAllReservation);
router.get('/:id', reservationsController.getSingleReservation);
router.use(authenticate)
router.post('/', reservationsController.createReservation);
router.put('/:id', reservationsController.updateReservation);
router.delete('/:id', reservationsController.deleteReservation);

module.exports = router;