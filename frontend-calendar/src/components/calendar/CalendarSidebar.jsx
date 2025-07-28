/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

const Sidebar = styled.div`
  width: 280px;
  background-color: ${({ theme }) => theme.colors.light};
  border-right: 1px solid #e0e0e0;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const CalendarSidebar = () => {
  return (
    <Sidebar>
      <h3 style={{ fontFamily: "'Sora', sans-serif", marginBottom: 16 }}>Calendarios</h3>
      {/* Aquí luego insertaremos el mini-calendario y la lista de usuarios */}
      <p>Próximamente mini-calendario y usuarios...</p>
    </Sidebar>
  );
};

export default CalendarSidebar;
