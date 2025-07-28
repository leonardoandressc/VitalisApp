/** @jsxImportSource @emotion/react */
import React from "react";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Registro</h2>
      <form style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "300px", margin: "2rem auto" }}>
        <input type="text" placeholder="Nombre" />
        <input type="email" placeholder="Correo" />
        <input type="password" placeholder="Contraseña" />
        <button type="submit">Registrarse</button>
      </form>
      <p>
        ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
      </p>
    </div>
  );
}

export default Register;
