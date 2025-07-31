/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import DoctorProfileForm from './DoctorProfileForm';
import { css } from '@emotion/react';

const overlayStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const modalStyles = css`
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const headerStyles = css`
  padding: 24px 32px 16px;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
`;

const titleStyles = css`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
`;

const subtitleStyles = css`
  color: #6b7280;
  margin: 0;
`;

export default function ProfileSetupWrapper({ children }) {
  const { user, profileStatus, checkProfileStatus } = useAuth();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (user && user.is_verified) {
        try {
          await checkProfileStatus();
        } catch (error) {
          console.error('Error checking profile status:', error);
        }
      }
      setIsLoading(false);
    };

    checkProfile();
  }, [user, checkProfileStatus]);

  useEffect(() => {
    if (!isLoading && user && user.is_verified && profileStatus) {
      // Mostrar formulario si el usuario está verificado pero no tiene perfil completo
      setShowProfileForm(!profileStatus.profile_completed);
    }
  }, [user, profileStatus, isLoading]);

  const handleProfileComplete = () => {
    setShowProfileForm(false);
  };

  if (isLoading) {
    return children; // Mostrar contenido mientras carga
  }

  return (
    <>
      {children}
      {showProfileForm && (
        <div css={overlayStyles}>
          <div css={modalStyles}>
            <div css={headerStyles}>
              <h2 css={titleStyles}>Completa tu Perfil Profesional</h2>
              <p css={subtitleStyles}>
                Para comenzar a usar la plataforma, necesitamos algunos datos profesionales
              </p>
            </div>
            <DoctorProfileForm onComplete={handleProfileComplete} />
          </div>
        </div>
      )}
    </>
  );
}