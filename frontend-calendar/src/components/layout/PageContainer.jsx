/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const Header = styled.header` /* Tu toolbar */
  height: 60px;
  /* estilos... */
`;

const Container = styled.div`
  padding: 1rem;
  flex: 1;
  overflow: auto; /* Scroll interno solo aquí */
  
  /* Ocultar scrollbar visual pero mantener funcionalidad */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
`;

export default function PageContainer({ children }) {
  return (
    <PageLayout>
      <Header>{/* Tu toolbar */}</Header>
      <Container>{children}</Container>
    </PageLayout>
  );
}