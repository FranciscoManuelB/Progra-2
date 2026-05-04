import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";

function Personas() {
  const [personas, setPersonas] = useState([]);
  const [editando, setEditando] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    direccion: "",
    poblacion: "",
    telefono: "",
    dni: ""
  });

  const cargarPersonas = async () => {
    const res = await API.get("/personas");
    setPersonas(res.data.data);
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await API.put(`/personas/${form.dni}`, form);
        Swal.fire("Actualizado", "Persona editada", "success");
      } else {
        await API.post("/personas", form);
        Swal.fire("Creado", "Persona creada", "success");
      }

      setForm({
        nombre: "",
        apellidos: "",
        direccion: "",
        poblacion: "",
        telefono: "",
        dni: ""
      });

      setEditando(false);
      cargarPersonas();

    } catch {
      Swal.fire("Error", "Algo falló", "error");
    }
  };

  const editar = (p) => {
    setForm(p);
    setEditando(true);
  };

  const eliminar = async (dni) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar?",
      showCancelButton: true
    });

    if (confirm.isConfirmed) {
      await API.delete(`/personas/${dni}`);
      Swal.fire("Eliminado", "Persona eliminada", "success");
      cargarPersonas();
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-xl mb-4">Personas</h2>

        <form onSubmit={guardar} className="grid grid-cols-3 gap-2 mb-4">
          <input className="border p-2" name="nombre" value={form.nombre} placeholder="Nombre" onChange={handleChange} />
          <input className="border p-2" name="apellidos" value={form.apellidos} placeholder="Apellidos" onChange={handleChange} />
          <input className="border p-2" name="direccion" value={form.direccion} placeholder="Dirección" onChange={handleChange} />
          <input className="border p-2" name="poblacion" value={form.poblacion} placeholder="Población" onChange={handleChange} />
          <input className="border p-2" name="telefono" value={form.telefono} placeholder="Teléfono" onChange={handleChange} />
          <input className="border p-2" name="dni" value={form.dni} placeholder="DNI" onChange={handleChange} />

          <button className="bg-blue-500 text-white p-2 col-span-3 rounded">
            {editando ? "Actualizar" : "Crear"}
          </button>
        </form>

        <table className="w-full border shadow">
          <thead className="bg-gray-200">
            <tr>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {personas.map((p) => (
              <tr key={p.dni}>
                <td>{p.nombre}</td>
                <td>{p.dni}</td>
                <td className="space-x-2">
                  <button className="bg-yellow-400 px-2" onClick={() => editar(p)}>Editar</button>
                  <button className="bg-red-500 text-white px-2" onClick={() => eliminar(p.dni)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Personas;