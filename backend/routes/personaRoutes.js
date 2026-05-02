const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/personaController');
const verifyToken = require('../middleware/verifyToken');

router.get('/',         verifyToken, ctrl.getAll);
router.get('/:dni',     verifyToken, ctrl.getOne);
router.post('/',        verifyToken, ctrl.create);
router.put('/:dni',     verifyToken, ctrl.update);
router.delete('/:dni',  verifyToken, ctrl.remove);

module.exports = router;
