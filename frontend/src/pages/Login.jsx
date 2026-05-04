import { useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        usuario,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", res.data.usuario);
      localStorage.setItem("rol", res.data.rol);

      Swal.fire("Bienvenido", "Login exitoso", "success");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);

    } catch (error) {
      Swal.fire("Error", "Credenciales incorrectas", "error");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4 text-center">Login</h2>

        <input
          type="text"
          placeholder="Usuario"
          className="border p-2 w-full mb-2"
          onChange={(e) => setUsuario(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-500 text-white w-full py-2 rounded">
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Login;