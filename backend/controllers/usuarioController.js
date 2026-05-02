const bcrypt = require('bcrypt');
const db     = require('../config/db');

const ROUNDS = 10;

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, usuario, rol, imagen, creado_en FROM usuarios');
    res.status(200).json({ success: true, data: rows, message: 'Usuarios obtenidos correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al obtener usuarios' });
  }
};

const getOne = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, usuario, rol, imagen, creado_en FROM usuarios WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Usuario no encontrado' });
    }
    res.status(200).json({ success: true, data: rows[0], message: 'Usuario obtenido correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al obtener el usuario' });
  }
};

const updateRol = async (req, res) => {
  const { rol } = req.body;
  const rolesValidos = ['admin', 'usuario', 'moderador'];

  if (!rol || !rolesValidos.includes(rol)) {
    return res.status(400).json({ success: false, data: null, message: 'Rol inválido' });
  }

  try {
    const [result] = await db.query('UPDATE usuarios SET rol = ? WHERE id = ?', [rol, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Usuario no encontrado' });
    }
    res.status(200).json({ success: true, data: null, message: 'Rol actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al actualizar el rol' });
  }
};

const updatePassword = async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, data: null, message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const hash = await bcrypt.hash(password, ROUNDS);
    const [result] = await db.query('UPDATE usuarios SET password = ? WHERE id = ?', [hash, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Usuario no encontrado' });
    }
    res.status(200).json({ success: true, data: null, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al actualizar la contraseña' });
  }
};

const remove = async (req, res) => {
  try {
    // Evitar que un admin se elimine a sí mismo
    if (parseInt(req.params.id) === req.usuario.id) {
      return res.status(400).json({ success: false, data: null, message: 'No puedes eliminar tu propio usuario' });
    }

    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Usuario no encontrado' });
    }
    res.status(200).json({ success: true, data: null, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al eliminar el usuario' });
  }
};

module.exports = { getAll, getOne, updateRol, updatePassword, remove };
