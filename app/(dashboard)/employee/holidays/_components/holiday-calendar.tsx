"use client";

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Gift, AlertTriangle, X } from 'lucide-react';

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
    backgroundColor: holiday.isRecurring ? '#10B981' : '#3B82F6',
    borderColor: holiday.isRecurring ? '#059669' : '#2563EB',
    textColor: '#FFFFFF',
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
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Holiday Calendar</CardTitle>
          <CardDescription>Loading your holiday schedule...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-[400px] w-full" />
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center">
            <AlertTriangle className="mr-2" />
            Error Loading Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2" />
          Holiday Calendar
        </CardTitle>
        <CardDescription>View and manage your holiday schedule</CardDescription>
      </CardHeader>
      <CardContent>
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
          eventContent={(eventInfo) => (
            <div className="flex items-center p-1">
              <Gift className="mr-1 h-4 w-4" />
              <span>{eventInfo.event.title}</span>
            </div>
          )}
        />
      </CardContent>

      <AnimatePresence>
        {selectedHoliday && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedHoliday.title}</h2>
                <Button variant="ghost" size="icon" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <strong className="text-gray-700 dark:text-gray-300">Date:</strong>
                  <span className="ml-2">{new Date(selectedHoliday.date).toLocaleDateString()}</span>
                </div>
                {selectedHoliday.description && (
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Description:</strong>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{selectedHoliday.description}</p>
                  </div>
                )}
                <div>
                  <strong className="text-gray-700 dark:text-gray-300">Type:</strong>
                  <Badge variant={selectedHoliday.isRecurring ? "secondary" : "default"} className="ml-2">
                    {selectedHoliday.isRecurring ? 'Recurring' : 'One-time'}
                  </Badge>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}