const router = require('express').Router();
const tablesController = require('../controller/tables')
const { authenticate } = require('../middleware/Auth')

router.get('/', tablesController.getAllTables);
router.get('/:id', tablesController.getSingleTables);
router.use(authenticate)
router.post('/', tablesController.createTable);
router.put('/:id', tablesController.updateTable);
router.delete('/:id', tablesController.deleteTable);

module.exports = router;