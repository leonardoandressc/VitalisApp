/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 1rem;
  flex: 1;  /* Ocupa el espacio disponible */
  overflow: auto; /* O hidden si no quieres scroll */
  height: auto; /* Asegura que el contenedor ocupe todo el alto disponible */
  
  /* Opcional: estilos para ocultar scrollbars pero mantener funcionalidad */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
`;

export default function PageContainer({ children }) {
  return <Container>{children}</Container>;
}
