/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuth } from '../auth/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
  font-size: 2rem;
`;

const Message = styled.p`
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 2px;
  font-weight: bold;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 15px;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  
  &:hover {
    background: #667eea;
    color: white;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-bottom: 20px;
  padding: 10px;
  background: #fdf2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
`;

const SuccessMessage = styled.div`
  color: #10b981;
  margin-bottom: 20px;
  padding: 10px;
  background: #f0fdf4;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
`;

export default function EmailVerification() {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay usuario o ya está verificado, redirigir
    if (!user) {
      navigate('/login');
    } else if (user.is_verified) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setError('Por favor ingresa el código de verificación');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          email: user.email,
          code: verificationCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('¡Email verificado exitosamente! Redirigiendo...');
        // Actualizar el usuario en el contexto
        setTimeout(() => {
          window.location.reload(); // Recargar para actualizar el contexto
        }, 2000);
      } else {
        setError(data.error || 'Código de verificación inválido');
      }
    } catch (error) {
      setError('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          email: user.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Código de verificación reenviado a tu email');
      } else {
        setError(data.error || 'Error al reenviar el código');
      }
    } catch (error) {
      setError('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Card>
        <Title>Verificar Email</Title>
        <Message>
          Hemos enviado un código de verificación a <strong>{user.email}</strong>.
          Por favor revisa tu bandeja de entrada y spam.
        </Message>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <form onSubmit={handleVerify}>
          <Input
            type="text"
            placeholder="Código de verificación"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
          />
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar Email'}
          </Button>
        </form>
        
        <SecondaryButton 
          type="button" 
          onClick={handleResendCode}
          disabled={resendLoading}
        >
          {resendLoading ? 'Reenviando...' : 'Reenviar Código'}
        </SecondaryButton>
        
        <SecondaryButton type="button" onClick={handleLogout}>
          Cerrar Sesión
        </SecondaryButton>
      </Card>
    </Container>
  );
}