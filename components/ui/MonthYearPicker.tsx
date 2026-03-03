import { useState, useRef, useEffect } from "react";

const MONTHS = [
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

interface MonthYearPickerProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select month & year",
}: MonthYearPickerProps) {
  const parts = value ? value.split(" ") : [];
  const selMonth = parts[0] || "";
  const selYear = parts[1] ? parseInt(parts[1]) : new Date().getFullYear();

  const [year, setYear] = useState(selYear);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync year when value changes externally
  useEffect(() => {
    if (parts[1]) setYear(parseInt(parts[1]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const select = (m: string) => {
    onChange(`${m} ${year}`);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-left text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
      >
        <span className={value ? "" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <span className="material-icons text-sm text-gray-400">
          calendar_today
        </span>
      </button>

      {open && (
        <div className="absolute z-[60] top-full mt-1 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-3 w-56">
          <div className="flex justify-between items-center mb-3">
            <button
              type="button"
              onClick={() => setYear((y) => y - 1)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <span className="material-icons text-base">chevron_left</span>
            </button>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {year}
            </span>
            <button
              type="button"
              onClick={() => setYear((y) => y + 1)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <span className="material-icons text-base">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => select(m)}
                className={`text-xs py-1.5 rounded-lg transition font-medium ${
                  selMonth === m && selYear === year
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
