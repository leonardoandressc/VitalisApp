/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Calendar from '../components/calendar/Calendar';
import CalendarSidebar from '../components/calendar/CalendarSidebar';
import CalendarToolbar from '../components/calendar/CalendarToolbar';

const CalendarView = () => {
  return (
    <div
      css={css`
        display: flex;
        height: 100%;
        background-color: ${({ theme }) => theme.colors.background};
      `}
    >
      <CalendarSidebar />
      <div
        css={css`
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        `}
      >
        <CalendarToolbar />
        <Calendar />
      </div>
    </div>
  );
};

export default CalendarView;
