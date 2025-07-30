/** @jsxImportSource @emotion/react */
import PageContainer from '../layout/PageContainer';
import CalendarToolbar from './CalendarToolbar';
import Calendar from './Calendar';

export default function CalendarPage() {
  return (
    <PageContainer>
      <Calendar 
      height="auto"
      ContentHeight="auto"
      />
    </PageContainer>
  );
}
