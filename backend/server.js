const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const authRoutes     = require('./routes/authRoutes');
const personaRoutes  = require('./routes/personaRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const accidenteRoutes= require('./routes/accidenteRoutes');
const multaRoutes    = require('./routes/multaRoutes');
const usuarioRoutes  = require('./routes/usuarioRoutes');

app.use('/api/auth',      authRoutes);
app.use('/api/personas',  personaRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/accidentes',accidenteRoutes);
app.use('/api/multas',    multaRoutes);
app.use('/api/usuarios',  usuarioRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Agencia de Seguros funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
