/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: auto;
    width: auto;
`;

export default function PageContainer({ children }) {
  return <Container>{children}</Container>;
}
