const db = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, p.nombre, p.apellidos, v.marca, v.modelo
      FROM MULTA m
      JOIN PERSONA p ON m.dni = p.dni
      JOIN VEHICULO v ON m.matricula = v.matricula
    `);
    res.status(200).json({ success: true, data: rows, message: 'Multas obtenidas correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al obtener multas' });
  }
};

const getOne = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, p.nombre, p.apellidos, v.marca, v.modelo
      FROM MULTA m
      JOIN PERSONA p ON m.dni = p.dni
      JOIN VEHICULO v ON m.matricula = v.matricula
      WHERE m.num_referencia = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Multa no encontrada' });
    }
    res.status(200).json({ success: true, data: rows[0], message: 'Multa obtenida correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al obtener la multa' });
  }
};

const create = async (req, res) => {
  const { fecha, hora, lugar_infraccion, importe, dni, matricula } = req.body;

  if (!fecha || !hora || !lugar_infraccion || !importe || !dni || !matricula) {
    return res.status(400).json({ success: false, data: null, message: 'Todos los campos son obligatorios' });
  }

  try {
    await db.query(
      'INSERT INTO MULTA (fecha, hora, lugar_infraccion, importe, dni, matricula) VALUES (?, ?, ?, ?, ?, ?)',
      [fecha, hora, lugar_infraccion, importe, dni, matricula]
    );
    res.status(201).json({ success: true, data: null, message: 'Multa registrada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al registrar la multa' });
  }
};

const update = async (req, res) => {
  const { fecha, hora, lugar_infraccion, importe, dni, matricula } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE MULTA SET fecha = ?, hora = ?, lugar_infraccion = ?, importe = ?, dni = ?, matricula = ? WHERE num_referencia = ?',
      [fecha, hora, lugar_infraccion, importe, dni, matricula, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Multa no encontrada' });
    }
    res.status(200).json({ success: true, data: null, message: 'Multa actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al actualizar la multa' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM MULTA WHERE num_referencia = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Multa no encontrada' });
    }
    res.status(200).json({ success: true, data: null, message: 'Multa eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al eliminar la multa' });
  }
};

module.exports = { getAll, getOne, create, update, remove };
