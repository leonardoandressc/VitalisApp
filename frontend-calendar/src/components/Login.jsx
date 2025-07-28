/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import { useState } from "react";
import logo from "../assets/logo.png"; // Ajusta la ruta si es diferente
import { Link } from "react-router-dom";

function Login() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const containerStyle = css`
    min-height: 100vh;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: ${theme.fonts.body};
    transition: background-color 0.3s ease, color 0.3s ease;
  `;

  const cardStyle = css`
    background-color: ${theme.colors.cardBackground};
    padding: 2rem;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 400px;
  `;

  const headingStyle = css`
    font-family: ${theme.fonts.heading};
    font-weight: 700;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
  `;

  const inputStyle = css`
    width: 100%;
    padding: 0.8rem 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
    border: none;
    background-color: ${theme.colors.inputBackground};
    color: ${theme.colors.textSecondary};
    font-size: 1rem;
    &::placeholder {
      color: ${theme.colors.inputPlaceholder};
    }
    &:focus {
      outline: 2px solid ${theme.colors.primary};
    }
  `;

  const buttonStyle = css`
    width: 100%;
    background-color: ${theme.colors.primary};
    color: white;
    font-weight: 700;
    padding: 0.9rem 0;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: ${theme.colors.secondary};
    }
  `;

  const footerText = css`
    margin-top: 1rem;
    font-size: 0.9rem;
    text-align: center;
    a {
      color: ${theme.colors.primary};
      text-decoration: none;
      font-weight: 600;
      &:hover {
        text-decoration: underline;
      }
    }
  `
  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora solo imprimir en consola
    console.log("Intentando login con", { email, password });
    // Aquí iría llamada API para login
};

  return (
    <div css={containerStyle}>
      <div css={cardStyle}>
        <div css={css`
            display: flex;
            justify-content: center;
            margin-bottom: 1rem;
            `}>
            <img 
                src={logo} 
                alt="Logo" 
                css={css`
                width: auto;
                max-width: 100%;
                `}
            />
            </div>
    <h1 css={headingStyle}>Iniciar Sesión</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Aquí puedes manejar el submit
            console.log("Email:", email, "Password:", password);
            handleSubmit(e);
          }}
        >
          <input
            type="email"
            placeholder="Correo electrónico"
            css={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            css={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" css={buttonStyle}>
            Iniciar sesión
          </button>
        </form>
        <p css={footerText}>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
