const db = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM PERSONA');
    res.status(200).json({ success: true, data: rows, message: 'Personas obtenidas correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al obtener personas' });
  }
};

const getOne = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM PERSONA WHERE dni = ?', [req.params.dni]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Persona no encontrada' });
    }
    res.status(200).json({ success: true, data: rows[0], message: 'Persona obtenida correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al obtener la persona' });
  }
};

const create = async (req, res) => {
  const { dni, nombre, apellidos, direccion, poblacion, telefono } = req.body;

  if (!dni || !nombre || !apellidos) {
    return res.status(400).json({ success: false, data: null, message: 'DNI, nombre y apellidos son obligatorios' });
  }

  try {
    await db.query(
      'INSERT INTO PERSONA (dni, nombre, apellidos, direccion, poblacion, telefono) VALUES (?, ?, ?, ?, ?, ?)',
      [dni, nombre, apellidos, direccion, poblacion, telefono]
    );
    res.status(201).json({ success: true, data: null, message: 'Persona creada correctamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, data: null, message: 'Ya existe una persona con ese DNI' });
    }
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al crear la persona' });
  }
};

const update = async (req, res) => {
  const { nombre, apellidos, direccion, poblacion, telefono } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE PERSONA SET nombre = ?, apellidos = ?, direccion = ?, poblacion = ?, telefono = ? WHERE dni = ?',
      [nombre, apellidos, direccion, poblacion, telefono, req.params.dni]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Persona no encontrada' });
    }
    res.status(200).json({ success: true, data: null, message: 'Persona actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al actualizar la persona' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM PERSONA WHERE dni = ?', [req.params.dni]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Persona no encontrada' });
    }
    res.status(200).json({ success: true, data: null, message: 'Persona eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al eliminar la persona' });
  }
};

module.exports = { getAll, getOne, create, update, remove };
