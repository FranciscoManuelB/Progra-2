const express     = require('express');
const router      = express.Router();
const ctrl        = require('../controllers/vehiculoController');
const verifyToken = require('../middleware/verifyToken');

router.get('/',                verifyToken, ctrl.getAll);
router.get('/:matricula',     verifyToken, ctrl.getOne);
router.post('/',              verifyToken, ctrl.create);
router.put('/:matricula',     verifyToken, ctrl.update);
router.delete('/:matricula',  verifyToken, ctrl.remove);

module.exports = router;
