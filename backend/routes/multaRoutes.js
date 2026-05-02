const express     = require('express');
const router      = express.Router();
const ctrl        = require('../controllers/multaController');
const verifyToken = require('../middleware/verifyToken');

router.get('/',      verifyToken, ctrl.getAll);
router.get('/:id',   verifyToken, ctrl.getOne);
router.post('/',     verifyToken, ctrl.create);
router.put('/:id',   verifyToken, ctrl.update);
router.delete('/:id',verifyToken, ctrl.remove);

module.exports = router;
