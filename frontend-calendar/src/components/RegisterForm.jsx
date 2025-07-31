import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/logo.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Logo = styled.img`
  width: 100%;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-family: "Sora", sans-serif;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  background: ${({ theme }) => theme.colors.cardBackground};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 1rem;
  text-align: center;
`;

export default function RegisterForm() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await register({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
      });
      
      // Después del registro exitoso, redirigir a verificación de email
      navigate("/verify-email");
    } catch (err) {
      console.error("Error en registro:", err);
      setError(err.response?.data?.error || "Error al registrar. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Logo src={logo} alt="Logo" />
        <Title>Crear cuenta</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input name="name" placeholder="Nombre" onChange={handleChange} />
        <Input name="email" placeholder="Correo" type="email" onChange={handleChange} />
        <Input name="password" placeholder="Contraseña" type="password" onChange={handleChange} />
        <Input name="confirmPassword" placeholder="Confirmar contraseña" type="password" onChange={handleChange} />
        <Button type="submit">Registrarse</Button>
      </Form>
    </Container>
  );
}
