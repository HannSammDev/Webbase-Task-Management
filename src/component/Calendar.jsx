import React from "react";
import { Calendar as PrimeCalendar } from "primereact/calendar";
import { Badge } from "primereact/badge";
import { useState } from "react";
export const Calendar = () => {
  // example due dates: May 25 and May 30, 2026 (months are 0-based)
  const dueDates = [new Date(2026, 4, 25), new Date(2026, 4, 30)];
  const [date, setDate] = useState(dueDates[0]);

  return (
    <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72">
      <div className="relative flex items-start justify-center h-full">
        <div className="card flex justify-content-center w-full h-full">
          <PrimeCalendar
            value={date}
            onChange={(e) => setDate(e.value)}
            inline
            showWeek
            className="w-full h-full"
            style={{ width: "100%" }}
            dateTemplate={(d) => {
              const isDate = (x) => x instanceof Date;
              const isCell = (x) => x && typeof x === "object" && "day" in x;

              const formatDay = (x) => {
                if (isDate(x)) return x.getDate();
                if (isCell(x)) return x.day;
                return "";
              };

              const matchesDue = (cell) => {
                return dueDates.some((dd) => {
                  if (isDate(cell)) {
                    return (
                      dd.getFullYear() === cell.getFullYear() &&
                      dd.getMonth() === cell.getMonth() &&
                      dd.getDate() === cell.getDate()
                    );
                  }
                  if (isCell(cell)) {
                    const monthMatches =
                      dd.getMonth() === cell.month ||
                      dd.getMonth() + 1 === cell.month;
                    return (
                      dd.getFullYear() === cell.year &&
                      monthMatches &&
                      dd.getDate() === cell.day
                    );
                  }
                  return false;
                });
              };

              const dayNumber = formatDay(d);
              const isDue = matchesDue(d);

              if (isDue) {
                return (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white">
                    {dayNumber}
                  </div>
                );
              }

              return (
                <div className="w-8 h-8 flex items-center justify-center">
                  {dayNumber}
                </div>
              );
            }}
          />
        </div>

        <div className="absolute top-2 left-2 flex items-center gap-2">
          <Badge  severity="danger" />
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Due dates
          </p>
        </div>
      </div>
    </div>
  );
};
