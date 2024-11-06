import HolidayCalendar from './_components/holiday-calendar';

export default function HolidaysPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Company Holidays</h1>
      <HolidayCalendar />
    </div>
  );
}