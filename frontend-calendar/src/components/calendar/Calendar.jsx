/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import dayjs from "dayjs";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  background-color: ${({ theme }) => theme.colors.light};
  border-bottom: 1px solid #e0e0e0;
`;

const DayHeader = styled.div`
  padding: 12px;
  text-align: center;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  grid-template-rows: repeat(24, 60px); /* 24 horas */
  flex-grow: 1;
`;

const TimeLabel = styled.div`
  padding: 4px;
  text-align: right;
  font-size: 12px;
  color: #888;
  border-bottom: 1px solid #eee;
`;

const Cell = styled.div`
  border-bottom: 1px solid #eee;
  border-left: 1px solid #eee;
`;

const Calendar = () => {
  const weekStart = dayjs().startOf("week").add(1, "day"); // lunes
  const days = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));

  return (
    <Container>
      <HeaderRow>
        <DayHeader>Hora</DayHeader>
        {days.map((day) => (
          <DayHeader key={day.format("YYYY-MM-DD")}>
            {day.format("ddd DD/MM")}
          </DayHeader>
        ))}
      </HeaderRow>

      <TimeGrid>
        {Array.from({ length: 24 }).map((_, hour) => (
          <TimeLabel key={`time-${hour}`}>{`${hour}:00`}</TimeLabel>
        ))}
        {Array.from({ length: 24 * 7 }).map((_, i) => (
          <Cell key={`cell-${i}`} />
        ))}
      </TimeGrid>
    </Container>
  );
};

export default Calendar;
