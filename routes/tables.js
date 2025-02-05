const router = require('express').Router();
const tablesController = require('../controller/tables')

router.get('/', tablesController.getAllTables);
router.get('/:id', tablesController.getSingleTables);
router.post('/', tablesController.createTable);
router.put('/:id', tablesController.updateTable);
router.delete('/:id', tablesController.deleteTable);

module.exports = router;