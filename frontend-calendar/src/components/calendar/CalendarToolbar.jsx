/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useState } from "react";
import dayjs from "dayjs";

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid #e0e0e0;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
`;

const CalendarToolbar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const goToday = () => setCurrentDate(dayjs());
  const goPrev = () => setCurrentDate(prev => prev.subtract(1, 'week'));
  const goNext = () => setCurrentDate(prev => prev.add(1, 'week'));

  return (
    <Toolbar>
      <div>
        <Button onClick={goPrev}>←</Button>
        <Button onClick={goToday} style={{ margin: "0 8px" }}>Hoy</Button>
        <Button onClick={goNext}>→</Button>
      </div>
      <h2 style={{ fontFamily: "'Sora', sans-serif" }}>{currentDate.format("MMMM D, YYYY")}</h2>
      <Button>+ Nuevo</Button>
    </Toolbar>
  );
};

export default CalendarToolbar;
