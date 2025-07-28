// components/Calendar.jsx
import styled from "@emotion/styled";
import { MdChevronLeft, MdChevronRight, MdToday } from "react-icons/md";

const CalendarContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1rem;
`;

export default function Calendar() {
  return (
    <CalendarContainer>
      {/* Controles del calendario */}
      <div css={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <button css={{ background: "none", border: "none", fontSize: "1.5rem" }}>
          <MdChevronLeft />
        </button>
        <h3 css={{ margin: 0 }}>Octubre 2023</h3>
        <button css={{ background: "none", border: "none", fontSize: "1.5rem" }}>
          <MdChevronRight />
        </button>
      </div>

      {/* Espacio para el calendario (integra FullCalendar aquí si lo usas) */}
      <div css={{ 
        height: "calc(100% - 50px)", 
        border: `1px dashed ${currentTheme.colors.accent}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <p>Contenido del calendario</p>
      </div>
    </CalendarContainer>
  );
}