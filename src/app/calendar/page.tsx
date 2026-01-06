
import Header from "@/components/layout/header";
import AppointmentsCalendar from "@/components/calendar/appointments-calendar";

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Calendrier" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <AppointmentsCalendar />
      </main>
    </div>
  );
}
