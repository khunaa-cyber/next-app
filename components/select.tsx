import React, { useState } from "react";

export default function SimpleSelect() {
  const [role, setRole] = useState("");

  return (
    <div className="p-6">
      <label htmlFor="role" className="block mb-1 text-sm font-medium">
        Хэрэглэгчийн төрөл
      </label>
      <select
        id="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border rounded px-3 py-2 w-[94px]"
      >
        <option value="client">Client</option>
        <option value="doctor">Doctor</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
}
