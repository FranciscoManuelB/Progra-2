import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [personas, setPersonas] = useState(0);
  const [vehiculos, setVehiculos] = useState(0);
  const [multas, setMultas] = useState(0);

  const usuario = localStorage.getItem("usuario");

  useEffect(() => {
    const cargar = async () => {
      try {
        const p = await API.get("/personas");
        setPersonas(p.data.data.length);

        const v = await API.get("/vehiculos");
        setVehiculos(v.data.data.length);

        const m = await API.get("/multas");
        setMultas(m.data.data.length);

      } catch (error) {
        console.error(error);
      }
    };

    cargar();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl mb-4">Bienvenido {usuario}</h1>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-500 text-white p-4 rounded shadow">
            Personas: {personas}
          </div>

          <div className="bg-green-500 text-white p-4 rounded shadow">
            Vehículos: {vehiculos}
          </div>

          <div className="bg-red-500 text-white p-4 rounded shadow">
            Multas: {multas}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;