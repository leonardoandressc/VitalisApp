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
        font-family: ${({ theme }) => theme.fonts.body};
      `}
    >
      <div
        css={css`
          width: 240px;
          border-right: 1px solid #e0e0e0;
          background-color: ${({ theme }) => theme.colors.light};
        `}
      >
        <CalendarSidebar />
      </div>

      <div
        css={css`
          flex: 1;
          display: flex;
          flex-direction: column;
        `}
      >
        <div
          css={css`
            height: 60px;
            border-bottom: 1px solid #e0e0e0;
            background-color: ${({ theme }) => theme.colors.light};
            display: flex;
            align-items: center;
            padding: 0 16px;
          `}
        >
          <CalendarToolbar />
        </div>

        <div
          css={css`
            flex: 1;
            overflow-y: auto;
            background-color: white;
          `}
        >
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
