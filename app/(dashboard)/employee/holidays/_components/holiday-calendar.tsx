"use client";
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Holiday {
  id: string;
  title: string;
  date: string;
  isRecurring: boolean;
}

export default function HolidayCalendar() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch('/api/holidays');
        if (!response.ok) throw new Error('Failed to fetch holidays');
        const data = await response.json();
        setHolidays(data);
      } catch (error) {
        console.error('Error fetching holidays:', error);
      }
    };

    fetchHolidays();
  }, []);

  const events = holidays.map(holiday => ({
    id: holiday.id,
    title: holiday.title,
    date: new Date(holiday.date).toISOString().split('T')[0],
    backgroundColor: holiday.isRecurring ? '#4CAF50' : '#2196F3',
    borderColor: holiday.isRecurring ? '#4CAF50' : '#2196F3',
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        height="auto"
        eventClick={(info) => {
          alert(`Holiday: ${info.event.title}`);
        }}
      />
    </div>
  );
}