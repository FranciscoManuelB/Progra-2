const checkRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para esta acción' });
    }
    next();
  };
};

module.exports = checkRole;
