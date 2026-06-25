import React, { useState, useMemo, useEffect } from "react";
import { db } from "../Config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const COLORS = {
  blue: { bg: "bg-[#1a73e8]", text: "text-white" },
  pink: { bg: "bg-[#e8567a]", text: "text-white" },
  green: { bg: "bg-[#34a853]", text: "text-white" },
  teal: { bg: "bg-[#009688]", text: "text-white" },
};

const todayBase = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function startOfWeek(d) {
  const r = new Date(d);
  r.setDate(r.getDate() - r.getDay());
  r.setHours(0, 0, 0, 0);
  return r;
}
function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function cloneDay(d) {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}
// Map Firestore task priority/status → calendar color
function taskToColor(priority) {
  if (priority === "high") return "pink";
  if (priority === "medium") return "teal";
  if (priority === "low") return "green";
  return "blue";
}

// Convert a Firestore task doc → calendar event shape
function taskToEvent(id, data) {
  const due = data.dueDate?.toDate?.() ?? new Date(data.dueDate);
  const start = new Date(due);
  start.setHours(9, 0, 0, 0); // default 9 AM if no time stored
  const end = new Date(due);
  end.setHours(10, 0, 0, 0); // 1-hour block
  return {
    id,
    title: data.title ?? "Untitled",
    sub: data.description ?? null,
    start,
    end,
    allDay: false,
    color: taskToColor(data.priority),
    status: data.status,
    priority: data.priority,
  };
}

const HR = 56,
  START_H = 7,
  END_H = 20,
  VIS = END_H - START_H;

function topPx(d) {
  return (d.getHours() - START_H + d.getMinutes() / 60) * HR;
}
function hPx(s, e) {
  return Math.max(((e - s) / 3600000) * HR, 20);
}

// ── Sub-components ──────────────────────────────────────────────

function DayWeekView({ days, events }) {
  const isSingle = days.length === 1;
  const now = new Date();

  const allDaySpanned = useMemo(() => {
    return events
      .filter((e) => e.allDay)
      .map((e) => {
        const spans = days.reduce((acc, d, i) => {
          const ds = cloneDay(e.start),
            de = cloneDay(e.end),
            dc = cloneDay(d);
          if (dc >= ds && dc <= de) acc.push(i);
          return acc;
        }, []);
        return { e, spans };
      })
      .filter((x) => x.spans.length > 0);
  }, [days, events]);

  return (
    <div className="flex flex-col h-full">
      {/* Day header */}
      <div className="flex border-b border-gray-200 sticky top-0 bg-white z-[5]">
        <div className="w-[52px]" />
        {days.map((d, i) => {
          const isT = sameDay(d, todayBase);
          return (
            <div
              key={i}
              className={`flex-1 text-center py-2 px-0.5 pb-1.5 ${i === 0 && isSingle ? "" : "border-l border-gray-200"}`}
            >
              <div
                className={`text-[11px] tracking-[.5px] uppercase ${isT ? "text-[#1a73e8]" : "text-gray-400"}`}
              >
                {DAYS_SHORT[d.getDay()]}
              </div>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mt-0.5 text-sm ${
                  isT
                    ? "bg-[#1a73e8] text-white font-medium"
                    : "bg-transparent text-gray-900 font-normal"
                }`}
              >
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* All-day row */}
      {allDaySpanned.length > 0 && (
        <div className="flex border-b border-gray-200 min-h-7 sticky top-[55px] bg-white z-[4]">
          <div className="w-[52px] text-[10px] text-gray-300 pt-1.5 text-right pr-1.5">
            all-day
          </div>
          <div className="flex-1 relative pb-1">
            {allDaySpanned.map(({ e, spans }, idx) => {
              const c = COLORS[e.color] || COLORS.blue;
              return (
                <div
                  key={idx}
                  className={`absolute top-1 h-[18px] ${c.bg} ${c.text} rounded-[3px] text-[11px] font-medium px-[5px] flex items-center overflow-hidden whitespace-nowrap`}
                  style={{
                    left: `calc(${(spans[0] / days.length) * 100}% + 2px)`,
                    width: `calc(${(spans.length / days.length) * 100}% - 4px)`,
                  }}
                >
                  {e.title}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex relative" style={{ minHeight: VIS * HR }}>
          {/* Time labels */}
          <div
            className="w-[52px] shrink-0 relative"
            style={{ height: VIS * HR }}
          >
            {Array.from({ length: VIS }, (_, i) => {
              const hr = START_H + i;
              const label =
                hr < 12 ? `${hr} AM` : hr === 12 ? "12 PM" : `${hr - 12} PM`;
              return i > 0 ? (
                <div
                  key={i}
                  className="absolute right-2 text-[10px] text-gray-300 whitespace-nowrap select-none"
                  style={{ top: i * HR - 7 }}
                >
                  {label}
                </div>
              ) : null;
            })}
          </div>

          {/* Columns */}
          <div className="flex-1 flex" style={{ height: VIS * HR }}>
            {days.map((d, col) => {
              const isWk = d.getDay() === 0 || d.getDay() === 6;
              const dayEvts = events.filter(
                (e) => !e.allDay && sameDay(e.start, d),
              );
              const nowTop = sameDay(d, todayBase)
                ? (now.getHours() - START_H + now.getMinutes() / 60) * HR
                : null;

              return (
                <div
                  key={col}
                  className={`flex-1 relative ${col === 0 && isSingle ? "" : "border-l border-gray-200"} ${isWk ? "bg-gray-50" : "bg-white"}`}
                >
                  {Array.from({ length: VIS }, (_, i) => (
                    <div
                      key={i}
                      className={`absolute left-0 right-0 ${i === 0 ? "border-t-0" : "border-t border-gray-100"}`}
                      style={{ top: i * HR }}
                    />
                  ))}

                  {nowTop !== null && nowTop >= 0 && nowTop <= VIS * HR && (
                    <>
                      <div
                        className="absolute w-2 h-2 rounded-full bg-[#e8567a] z-[6] -left-1"
                        style={{ top: nowTop - 4 }}
                      />
                      <div
                        className="absolute left-1 right-0 h-[1.5px] bg-[#e8567a] z-[6]"
                        style={{ top: nowTop }}
                      />
                    </>
                  )}

                  {dayEvts.map((e) => {
                    const top = topPx(e.start);
                    const height = hPx(e.start, e.end);
                    const hh = e.start.getHours(),
                      mm = e.start.getMinutes();
                    const h12 = hh % 12 || 12,
                      ampm = hh >= 12 ? "PM" : "AM";
                    const timeStr = `${h12}${mm > 0 ? ":" + String(mm).padStart(2, "0") : ""} ${ampm}`;
                    const c = COLORS[e.color] || COLORS.blue;
                    return (
                      <div
                        key={e.id}
                        className={`absolute mx-[3px] ${c.bg} ${c.text} rounded-[5px] p-[3px_5px] text-[11px] font-medium overflow-hidden cursor-default z-[2]`}
                        style={{ top, left: 3, right: 3, height }}
                      >
                        <div className="font-semibold text-[11px] whitespace-nowrap overflow-hidden text-ellipsis">
                          {e.title}
                        </div>
                        {e.sub && height > 34 && (
                          <div className="text-[10px] opacity-90 whitespace-nowrap overflow-hidden text-ellipsis">
                            {e.sub}
                          </div>
                        )}
                        {!e.sub && height > 34 && (
                          <div className="text-[10px] opacity-90">
                            {timeStr}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MonthView({ cursor, events }) {
  const yr = cursor.getFullYear(),
    mo = cursor.getMonth();
  const startDay = new Date(yr, mo, 1).getDay();
  const daysInMo = new Date(yr, mo + 1, 0).getDate();
  const prevMonthDays = new Date(yr, mo, 0).getDate();
  const totalCells = Math.ceil((startDay + daysInMo) / 7) * 7;
  const weeks = totalCells / 7;

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b border-gray-200">
        {DAYS_SHORT.map((d) => (
          <div
            key={d}
            className="text-center py-1.5 text-[11px] text-gray-400 tracking-[.5px] uppercase"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        {Array.from({ length: weeks }, (_, w) => (
          <div
            key={w}
            className="grid grid-cols-7 flex-1 border-b border-gray-200"
          >
            {Array.from({ length: 7 }, (_, d) => {
              const cellIdx = w * 7 + d;
              let cellDate,
                isOther = false;
              if (cellIdx < startDay) {
                cellDate = new Date(
                  yr,
                  mo - 1,
                  prevMonthDays - (startDay - 1 - cellIdx),
                );
                isOther = true;
              } else if (cellIdx >= startDay + daysInMo) {
                cellDate = new Date(
                  yr,
                  mo + 1,
                  cellIdx - startDay - daysInMo + 1,
                );
                isOther = true;
              } else {
                cellDate = new Date(yr, mo, cellIdx - startDay + 1);
              }

              const isT = sameDay(cellDate, todayBase);
              const dayEvts = isOther
                ? []
                : events.filter((e) => sameDay(e.start, cellDate));
              const visible = dayEvts.slice(0, 3);
              const more = dayEvts.length - 3;

              return (
                <div
                  key={d}
                  className={`${d === 0 ? "border-l-0" : "border-l border-gray-200"} p-1 pt-[4px] overflow-hidden min-h-[80px]`}
                >
                  <div
                    className={`w-[22px] h-[22px] rounded-full flex items-center justify-center mx-auto mb-0.5 text-xs ${
                      isT
                        ? "bg-[#1a73e8] text-white"
                        : isOther
                          ? "text-gray-300"
                          : "text-gray-900"
                    }`}
                  >
                    {cellDate.getDate()}
                  </div>
                  {visible.map((e) => {
                    const c = COLORS[e.color] || COLORS.blue;
                    return (
                      <div
                        key={e.id}
                        className={`text-[10px] font-medium rounded-[3px] px-1 py-px mb-px ${c.bg} ${c.text} whitespace-nowrap overflow-hidden text-ellipsis`}
                      >
                        {e.title}
                      </div>
                    );
                  })}
                  {more > 0 && (
                    <div className="text-[10px] text-gray-400 px-1 py-px">
                      +{more} more
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function YearView({ cursor, events }) {
  const yr = cursor.getFullYear();
  return (
    <div className="grid grid-cols-4 gap-5 p-4">
      {Array.from({ length: 12 }, (_, m) => {
        const first = new Date(yr, m, 1);
        const startDay = first.getDay();
        const daysInMo = new Date(yr, m + 1, 0).getDate();
        const prevDays = new Date(yr, m, 0).getDate();
        const totalCells = Math.ceil((startDay + daysInMo) / 7) * 7;
        return (
          <div key={m}>
            <div className="text-xs font-medium text-gray-900 mb-1.5 text-center">
              {MONTHS_SHORT[m]}
            </div>
            <div className="grid grid-cols-7 gap-px">
              {DAYS_SHORT.map((d) => (
                <div
                  key={d}
                  className="text-[9px] text-gray-300 text-center pb-0.5"
                >
                  {d[0]}
                </div>
              ))}
              {Array.from({ length: totalCells }, (_, c) => {
                let date,
                  isOther = false;
                if (c < startDay) {
                  date = new Date(yr, m - 1, prevDays - (startDay - 1 - c));
                  isOther = true;
                } else if (c >= startDay + daysInMo) {
                  date = new Date(yr, m + 1, c - startDay - daysInMo + 1);
                  isOther = true;
                } else {
                  date = new Date(yr, m, c - startDay + 1);
                }
                const isT = sameDay(date, todayBase);
                const hasEvt =
                  !isOther && events.some((e) => sameDay(e.start, date));
                return (
                  <div
                    key={c}
                    className={`text-[10px] text-center py-px relative ${isOther ? "text-gray-300" : "text-gray-900"}`}
                  >
                    {isT ? (
                      <span className="bg-[#1a73e8] text-white w-4 h-4 rounded-full inline-flex items-center justify-center">
                        {date.getDate()}
                      </span>
                    ) : (
                      date.getDate()
                    )}
                    {hasEvt && !isT && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1a73e8] block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Calendar ────────────────────────────────────────────────

export const Calendar = () => {
  const [view, setViewState] = useState("week");
  const [cursor, setCursor] = useState(new Date(todayBase));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live Firestore listener — updates calendar in real time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tasks"), (snap) => {
      const mapped = snap.docs.map((d) => taskToEvent(d.id, d.data()));
      setEvents(mapped);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const goToday = () => setCursor(new Date(todayBase));

  const navPrev = () => {
    if (view === "day") setCursor(addDays(cursor, -1));
    else if (view === "week") setCursor(addDays(cursor, -7));
    else if (view === "month")
      setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
    else setCursor(new Date(cursor.getFullYear() - 1, 0, 1));
  };

  const navNext = () => {
    if (view === "day") setCursor(addDays(cursor, 1));
    else if (view === "week") setCursor(addDays(cursor, 7));
    else if (view === "month")
      setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
    else setCursor(new Date(cursor.getFullYear() + 1, 0, 1));
  };

  const titleLabel = useMemo(() => {
    if (view === "day")
      return `${DAYS_SHORT[cursor.getDay()]}, ${MONTHS[cursor.getMonth()]} ${cursor.getDate()}, ${cursor.getFullYear()}`;
    if (view === "week") {
      const ws = startOfWeek(cursor),
        we = addDays(ws, 6);
      return ws.getMonth() === we.getMonth()
        ? `${MONTHS[ws.getMonth()]} ${ws.getFullYear()}`
        : `${MONTHS_SHORT[ws.getMonth()]} – ${MONTHS_SHORT[we.getMonth()]} ${we.getFullYear()}`;
    }
    if (view === "month")
      return `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;
    return `${cursor.getFullYear()}`;
  }, [view, cursor]);

  const days = useMemo(() => {
    if (view === "day") return [cloneDay(cursor)];
    const ws = startOfWeek(cursor);
    return Array.from({ length: 7 }, (_, i) => addDays(ws, i));
  }, [view, cursor]);

  const btnCls = (active) =>
    `px-3 py-1 rounded-lg border text-[13px] cursor-pointer ${
      active
        ? "border-[#1a73e8] bg-[#e8f0fe] text-[#1a73e8] font-medium"
        : "border-gray-300 bg-transparent text-gray-700 font-normal"
    }`;

  return (
    <div className="font-sans flex flex-col h-[600px] border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-gray-200 shrink-0 bg-white">
        <button className={btnCls(false)} onClick={goToday}>
          Today
        </button>
        <button
          onClick={navPrev}
          className="w-7 h-7 flex items-center justify-center rounded-full border-none bg-transparent cursor-pointer text-lg text-gray-500"
        >
          ‹
        </button>
        <button
          onClick={navNext}
          className="w-7 h-7 flex items-center justify-center rounded-full border-none bg-transparent cursor-pointer text-lg text-gray-500"
        >
          ›
        </button>
        <span className="text-base font-medium text-gray-900 min-w-[180px]">
          {titleLabel}
        </span>
        <div className="ml-auto flex gap-1.5">
          {["day", "week", "month", "year"].map((v) => (
            <button
              key={v}
              className={btnCls(view === v)}
              onClick={() => setViewState(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* View area */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            Loading tasks…
          </div>
        ) : (
          <>
            {(view === "day" || view === "week") && (
              <DayWeekView days={days} events={events} />
            )}
            {view === "month" && <MonthView cursor={cursor} events={events} />}
            {view === "year" && <YearView cursor={cursor} events={events} />}
          </>
        )}
      </div>
    </div>
  );
};
