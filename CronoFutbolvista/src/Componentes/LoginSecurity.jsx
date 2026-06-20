import { useState } from "react";

export default function LoginSecurity() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", credentials);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Gestión de Seguridad de Acceso
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Correo"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />

        <button
          className="w-full bg-green-600 text-white py-2 rounded"
          type="submit"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}