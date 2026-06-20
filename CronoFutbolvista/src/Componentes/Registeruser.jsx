import { useState } from "react";

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmarPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Usuario registrado:", formData);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Registro de Usuario</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmarPassword"
          placeholder="Confirmar contraseña"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded"
          type="submit"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}