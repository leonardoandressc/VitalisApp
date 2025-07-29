/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 1rem;
  height: 100%;
`;

export default function PageContainer({ children }) {
  return <Container>{children}</Container>;
}
