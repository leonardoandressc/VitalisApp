// routes/Register.jsx
import RegisterForm from "../components/RegisterForm";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default function Register() {
  return (
    <Container>
      <RegisterForm />
    </Container>
  );
}
