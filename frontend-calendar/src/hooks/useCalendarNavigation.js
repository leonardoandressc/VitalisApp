// hooks/useCalendarNavigation.js
import { useState } from "react";
import { useCallback } from "react";

export function useCalendarNavigation(initialDate = new Date()) {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const goToNextWeek = () => { ... };
  const goToPreviousWeek = () => { ... };

  return { currentDate, goToNextWeek, goToPreviousWeek };
}
