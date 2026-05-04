import { Link } from "react-router-dom";

function Navbar() {
  const rol = localStorage.getItem("rol");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/dashboard">Dashboard</Link>

      {rol === "admin" && (
        <>
          <Link to="/personas">Personas</Link>
        </>
      )}

      <button onClick={logout} className="ml-auto bg-red-500 px-3 py-1 rounded">
        Cerrar sesión
      </button>
    </div>
  );
}

export default Navbar;