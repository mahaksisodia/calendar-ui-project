"use client";
import { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isAfter,
  isBefore,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [notes, setNotes] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  // 📸 Month-based image
  const getMonthImage = (month) => {
    const images = [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce",
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66",
      "https://images.unsplash.com/photo-1482517967863-00e15c9b44be",
    ];
    return images[month];
  };

  // 📝 Load notes
  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(saved);
  }, []);

  // 💾 Save notes + message
  useEffect(() => {
    localStorage.setItem("notes", notes);
    setSavedMsg("Saved!");
    setTimeout(() => setSavedMsg(""), 1000);
  }, [notes]);

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const startDayIndex = getDay(start);

  const handleClick = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else {
      if (isBefore(day, startDate)) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const isInRange = (day) => {
    return (
      startDate &&
      endDate &&
      (isAfter(day, startDate) || isSameDay(day, startDate)) &&
      (isBefore(day, endDate) || isSameDay(day, endDate))
    );
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-5xl w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">

          {/* HERO IMAGE */}
          <div className="relative md:w-1/2 h-64 md:h-auto">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{
                backgroundImage: `url(${getMonthImage(currentMonth.getMonth())})`,
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-5">
              <h2 className="text-white text-2xl font-bold">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <p className="text-gray-200 text-sm">Plan your month ✨</p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-6 md:w-1/2 text-black">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="px-2 py-1 rounded hover:bg-gray-200"
              >
                ◀
              </button>

              <h2 className="text-xl font-bold">
                {format(currentMonth, "MMMM yyyy")}
              </h2>

              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="px-2 py-1 rounded hover:bg-gray-200"
              >
                ▶
              </button>
            </div>

            {/* TITLE */}
            <h3 className="text-lg font-semibold mb-2">Select Dates</h3>

            {/* WEEK DAYS */}
            <div className="grid grid-cols-7 text-center font-semibold mb-2 gap-2">
              {weekDays.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* GRID */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startDayIndex }).map((_, i) => (
                <div key={i}></div>
              ))}

              {days.map((day) => {
                const isStart = startDate && isSameDay(day, startDate);
                const isEnd = endDate && isSameDay(day, endDate);
                const isToday = isSameDay(day, new Date());
                const isWeekend =
                  day.getDay() === 0 || day.getDay() === 6;

                return (
                  <div
                    key={day}
                    onClick={() => handleClick(day)}
                    className={`h-10 flex items-center justify-center cursor-pointer rounded-lg border text-sm font-medium transition-all duration-200 hover:scale-105
                      ${isInRange(day) ? "bg-gradient-to-r from-blue-200 to-blue-300" : ""}
                      ${isStart ? "bg-blue-500 text-white" : ""}
                      ${isEnd ? "bg-blue-700 text-white" : ""}
                      ${isToday ? "border-2 border-red-500 font-bold" : "border-gray-300"}
                      ${isWeekend ? "text-red-500" : ""}
                      hover:bg-blue-100`}
                  >
                    {format(day, "d")}
                  </div>
                );
              })}
            </div>

            {/* CLEAR BUTTON */}
            <button
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
              }}
              className="mt-3 text-sm text-blue-600 underline"
            >
              Clear Selection
            </button>

            {/* NOTES */}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write notes..."
              className="w-full mt-4 border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* SAVED MESSAGE */}
            <p className="text-green-500 text-sm mt-1">{savedMsg}</p>
          </div>
        </div>
      </div>
    </div>
  );
}