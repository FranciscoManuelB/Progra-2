const db = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*,
        GROUP_CONCAT(DISTINCT ap.dni) AS personas,
        GROUP_CONCAT(DISTINCT av.matricula) AS vehiculos
      FROM ACCIDENTE a
      LEFT JOIN ACCIDENTE_PERSONA ap ON a.num_referencia = ap.num_referencia
      LEFT JOIN ACCIDENTE_VEHICULO av ON a.num_referencia = av.num_referencia
      GROUP BY a.num_referencia
    `);
    res.status(200).json({ success: true, data: rows, message: 'Accidentes obtenidos correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al obtener accidentes' });
  }
};

const getOne = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ACCIDENTE WHERE num_referencia = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Accidente no encontrado' });
    }
    const [personas] = await db.query('SELECT dni FROM ACCIDENTE_PERSONA WHERE num_referencia = ?', [req.params.id]);
    const [vehiculos] = await db.query('SELECT matricula FROM ACCIDENTE_VEHICULO WHERE num_referencia = ?', [req.params.id]);

    res.status(200).json({
      success: true,
      data: { ...rows[0], personas, vehiculos },
      message: 'Accidente obtenido correctamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al obtener el accidente' });
  }
};

const create = async (req, res) => {
  const { fecha, hora, lugar, personas = [], vehiculos = [] } = req.body;

  if (!fecha || !hora || !lugar) {
    return res.status(400).json({ success: false, data: null, message: 'Fecha, hora y lugar son obligatorios' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO ACCIDENTE (fecha, hora, lugar) VALUES (?, ?, ?)',
      [fecha, hora, lugar]
    );
    const num_referencia = result.insertId;

    for (const dni of personas) {
      await conn.query('INSERT INTO ACCIDENTE_PERSONA (num_referencia, dni) VALUES (?, ?)', [num_referencia, dni]);
    }

    for (const matricula of vehiculos) {
      await conn.query('INSERT INTO ACCIDENTE_VEHICULO (num_referencia, matricula) VALUES (?, ?)', [num_referencia, matricula]);
    }

    await conn.commit();
    res.status(201).json({ success: true, data: { num_referencia }, message: 'Accidente registrado correctamente' });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al registrar el accidente' });
  } finally {
    conn.release();
  }
};

const update = async (req, res) => {
  const { fecha, hora, lugar } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE ACCIDENTE SET fecha = ?, hora = ?, lugar = ? WHERE num_referencia = ?',
      [fecha, hora, lugar, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, data: null, message: 'Accidente no encontrado' });
    }
    res.status(200).json({ success: true, data: null, message: 'Accidente actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al actualizar el accidente' });
  }
};

const remove = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('DELETE FROM ACCIDENTE_PERSONA WHERE num_referencia = ?', [req.params.id]);
    await conn.query('DELETE FROM ACCIDENTE_VEHICULO WHERE num_referencia = ?', [req.params.id]);
    const [result] = await conn.query('DELETE FROM ACCIDENTE WHERE num_referencia = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ success: false, data: null, message: 'Accidente no encontrado' });
    }

    await conn.commit();
    res.status(200).json({ success: true, data: null, message: 'Accidente eliminado correctamente' });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Error al eliminar el accidente' });
  } finally {
    conn.release();
  }
};

module.exports = { getAll, getOne, create, update, remove };
