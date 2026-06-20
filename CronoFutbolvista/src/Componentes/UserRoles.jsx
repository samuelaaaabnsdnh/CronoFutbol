import { useState } from "react";

export default function UserRoles() {
  const [userRole, setUserRole] = useState("Usuario");

  const roles = [
    "Administrador",
    "Supervisor",
    "Entrenador",
    "Usuario",
  ];

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Gestión de Roles de Usuario
      </h2>

      <div className="space-y-4">
        <select
          className="w-full border p-2 rounded"
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
        >
          {roles.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>

        <div className="bg-gray-100 p-4 rounded">
          <p>
            Rol asignado:{" "}
            <span className="font-bold">{userRole}</span>
          </p>
        </div>
      </div>
    </div>
  );
}