"use client";
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';

interface Holiday {
  id: string;
  title: string;
  date: string;
  isRecurring: boolean;
  description?: string;
  category?: string;
}

export default function HolidayCalendar() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/holidays');
        if (!response.ok) throw new Error('Failed to fetch holidays');
        const data = await response.json();
        setHolidays(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching holidays:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
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
    extendedProps: {
      description: holiday.description,
      category: holiday.category
    }
  }));

  const handleEventClick = (info: EventClickArg) => {
    const holidayId = info.event.id;
    const clickedHoliday = holidays.find(h => h.id === holidayId);
    setSelectedHoliday(clickedHoliday || null);
  };

  const closeModal = () => {
    setSelectedHoliday(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow relative">
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
        eventClick={handleEventClick}
      />

      {selectedHoliday && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">{selectedHoliday.title}</h2>
            <p className="mb-2">
              <strong>Date:</strong> {new Date(selectedHoliday.date).toLocaleDateString()}
            </p>
            {selectedHoliday.description && (
              <p className="mb-2">
                <strong>Description:</strong> {selectedHoliday.description}
              </p>
            )}
            <p className="mb-4">
              <strong>Type:</strong> {selectedHoliday.isRecurring ? 'Recurring' : 'One-time'}
            </p>
            <button 
              onClick={closeModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}