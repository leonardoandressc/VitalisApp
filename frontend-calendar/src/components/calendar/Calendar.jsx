/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  grid-template-rows: repeat(24, 60px);
  border-top: 1px solid #e0e0e0;
`;

const TimeCell = styled.div`
  border-bottom: 1px solid #e0e0e0;
  text-align: right;
  padding-right: 8px;
  font-size: 12px;
  color: #888;
`;

const DayCell = styled.div`
  border-bottom: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
`;

const Calendar = () => {
  return (
    <Grid>
      {Array.from({ length: 24 }).map((_, i) => (
        <TimeCell key={`hour-${i}`}>{i}:00</TimeCell>
      ))}
      {Array.from({ length: 24 * 7 }).map((_, i) => (
        <DayCell key={`cell-${i}`} />
      ))}
    </Grid>
  );
};

export default Calendar;
