const db = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM VEHICULO');
    res.status(200).json({ success: true, data: rows, message: 'Vehículos obtenidos correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al obtener vehículos' });
  }
};

const getOne = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM VEHICULO WHERE matricula = ?', [req.params.matricula]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Vehículo no encontrado' });
    }
    res.status(200).json({ success: true, data: rows[0], message: 'Vehículo obtenido correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al obtener el vehículo' });
  }
};

const create = async (req, res) => {
  const { matricula, marca, modelo } = req.body;

  if (!matricula || !marca || !modelo) {
    return res.status(400).json({ success: false, data: null, message: 'Matrícula, marca y modelo son obligatorios' });
  }

  try {
    await db.query(
      'INSERT INTO VEHICULO (matricula, marca, modelo) VALUES (?, ?, ?)',
      [matricula, marca, modelo]
    );
    res.status(201).json({ success: true, data: null, message: 'Vehículo creado correctamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, data: null, message: 'Ya existe un vehículo con esa matrícula' });
    }
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al crear el vehículo' });
  }
};

const update = async (req, res) => {
  const { marca, modelo } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE VEHICULO SET marca = ?, modelo = ? WHERE matricula = ?',
      [marca, modelo, req.params.matricula]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Vehículo no encontrado' });
    }
    res.status(200).json({ success: true, data: null, message: 'Vehículo actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al actualizar el vehículo' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM VEHICULO WHERE matricula = ?', [req.params.matricula]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Vehículo no encontrado' });
    }
    res.status(200).json({ success: true, data: null, message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al eliminar el vehículo' });
  }
};

module.exports = { getAll, getOne, create, update, remove };
