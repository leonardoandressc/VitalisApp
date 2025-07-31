/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Ajusta la ruta si es diferente
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, googleLogin, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Verificar si hay credenciales guardadas
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      await googleLogin(credentialResponse.credential);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en Google Login:", error);
      setError("Error al iniciar sesión con Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Error al iniciar sesión con Google");
  };, []);
  
  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate("/calendar");
    }
  }, [user, navigate]);

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

  const googleButtonStyle = css`
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
  `;

  const dividerStyle = css`
    text-align: center;
    margin: 1.5rem 0;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: ${theme.colors.inputBackground};
    }
    span {
      background: ${theme.colors.cardBackground};
      padding: 0 1rem;
      color: ${theme.colors.textSecondary};
      font-size: 0.9rem;
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Guardar email si recuérdame está activado
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }
      
      const result = await login(email, password, rememberMe);
      
      // Si el usuario no ha verificado su email, redirigir a verificación
      if (result.user && !result.user.is_verified) {
        navigate("/verify-email");
      } else {
        // Si ya está verificado, ir al dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      setError("Correo o contraseña incorrectos");
    } finally {
      setIsLoading(false);
    }
  };

  const checkboxStyle = css`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: ${theme.colors.textSecondary};
    
    input {
      margin-right: 0.5rem;
    }
  `;
  
  const errorStyle = css`
    color: ${theme.colors.error || '#e53e3e'};
    margin-bottom: 1rem;
    font-size: 0.9rem;
    text-align: center;
  `;

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
        
        {error && <p css={errorStyle}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            css={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            css={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <label css={checkboxStyle}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Recordar mi correo
          </label>
          
          <button 
            type="submit" 
            css={buttonStyle}
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
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
