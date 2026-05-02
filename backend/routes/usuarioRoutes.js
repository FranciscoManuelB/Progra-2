const express     = require('express');
const router      = express.Router();
const ctrl        = require('../controllers/usuarioController');
const verifyToken = require('../middleware/verifyToken');
const checkRole   = require('../middleware/checkRole');

// Solo admin puede gestionar usuarios
router.get('/',                verifyToken, checkRole('admin'), ctrl.getAll);
router.get('/:id',             verifyToken, checkRole('admin'), ctrl.getOne);
router.patch('/:id/rol',       verifyToken, checkRole('admin'), ctrl.updateRol);
router.patch('/:id/password',  verifyToken, checkRole('admin'), ctrl.updatePassword);
router.delete('/:id',          verifyToken, checkRole('admin'), ctrl.remove);

module.exports = router;
