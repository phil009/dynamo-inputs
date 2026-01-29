import { useState, useRef, useEffect, useCallback, useMemo } from 'preact/hooks';
import type { InputProps } from '../types';

interface DateInputProps extends InputProps {
  onFocus: () => void;
  onBlur: () => void;
}

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function parseDate(str: string): { year: number; month: number; day: number } | null {
  const m = str.match(/^(\d{4})[\/\-](\d{2})[\/\-](\d{2})$/);
  if (!m) return null;
  return { year: +m[1], month: +m[2] - 1, day: +m[3] };
}

function formatDate(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}/${mm}/${dd}`;
}

export function DateInput({ name, value, placeholder, minDate, maxDate, onFocus, onBlur, onChange }: DateInputProps) {
  const parsed = value ? parseDate(value) : null;
  const today = new Date();

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(parsed?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth());
  const wrapperRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    onBlur();
  }, [onBlur]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  const minParsed = minDate ? parseDate(minDate) : null;
  const maxParsed = maxDate ? parseDate(maxDate) : null;

  const isDisabled = useCallback((year: number, month: number, day: number) => {
    const d = new Date(year, month, day);
    if (minParsed) {
      const min = new Date(minParsed.year, minParsed.month, minParsed.day);
      if (d < min) return true;
    }
    if (maxParsed) {
      const max = new Date(maxParsed.year, maxParsed.month, maxParsed.day);
      if (d > max) return true;
    }
    return false;
  }, [minParsed, maxParsed]);

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const prevMonthDays = getDaysInMonth(viewYear, viewMonth - 1);

    const cells: { day: number; month: number; year: number; outside: boolean }[] = [];

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = viewMonth - 1;
      const y = m < 0 ? viewYear - 1 : viewYear;
      cells.push({ day: d, month: (m + 12) % 12, year: y, outside: true });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, month: viewMonth, year: viewYear, outside: false });
    }

    // Next month leading days (fill to 42 = 6 rows)
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth + 1;
      const y = m > 11 ? viewYear + 1 : viewYear;
      cells.push({ day: d, month: m % 12, year: y, outside: true });
    }

    return cells;
  }, [viewYear, viewMonth]);

  const handleDayClick = (cell: typeof calendarDays[0]) => {
    if (isDisabled(cell.year, cell.month, cell.day)) return;
    onChange?.(formatDate(cell.year, cell.month, cell.day));
    setViewYear(cell.year);
    setViewMonth(cell.month);
    close();
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isToday = (cell: typeof calendarDays[0]) =>
    cell.day === today.getDate() && cell.month === today.getMonth() && cell.year === today.getFullYear();

  const isSelected = (cell: typeof calendarDays[0]) =>
    parsed && cell.day === parsed.day && cell.month === parsed.month && cell.year === parsed.year;

  return (
    <>
      <input
        class="input-control"
        type="text"
        name={name}
        value={value}
        placeholder={placeholder ?? 'yyyy/mm/dd'}
        onFocus={onFocus}
        onBlur={(e) => {
          // Don't blur if clicking inside calendar
          if (wrapperRef.current?.contains(e.relatedTarget as Node)) return;
          if (!open) onBlur();
        }}
        onInput={(e) => onChange?.((e.target as HTMLInputElement).value)}
        autocomplete="off"
      />

      <div ref={wrapperRef} class="calendar-anchor">
        <button
          type="button"
          class="input-date-trigger"
          onClick={() => {
            if (open) {
              close();
            } else {
              if (parsed) {
                setViewYear(parsed.year);
                setViewMonth(parsed.month);
              }
              setOpen(true);
              onFocus();
            }
          }}
          aria-label="Open date picker"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 1v2M11 1v2M1 6h14M3 3h10a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        {open && (
          <div class="calendar-dropdown">
            {/* Header */}
            <div class="calendar-header">
              <button type="button" class="calendar-nav" onClick={prevMonth} aria-label="Previous month">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <span class="calendar-title">{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button" class="calendar-nav" onClick={nextMonth} aria-label="Next month">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Day labels */}
            <div class="calendar-grid calendar-day-labels">
              {DAYS.map((d) => (
                <span key={d} class="calendar-day-label">{d}</span>
              ))}
            </div>

            {/* Day cells */}
            <div class="calendar-grid">
              {calendarDays.map((cell, i) => {
                const disabled = isDisabled(cell.year, cell.month, cell.day);
                return (
                  <button
                    key={i}
                    type="button"
                    class={[
                      'calendar-day',
                      cell.outside ? 'outside' : '',
                      isToday(cell) ? 'today' : '',
                      isSelected(cell) ? 'selected' : '',
                      disabled ? 'disabled' : '',
                    ].filter(Boolean).join(' ')}
                    disabled={disabled}
                    onClick={() => handleDayClick(cell)}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>

            {/* Today shortcut */}
            <div class="calendar-footer">
              <button
                type="button"
                class="calendar-today-btn"
                onClick={() => {
                  const t = new Date();
                  onChange?.(formatDate(t.getFullYear(), t.getMonth(), t.getDate()));
                  setViewYear(t.getFullYear());
                  setViewMonth(t.getMonth());
                  close();
                }}
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
