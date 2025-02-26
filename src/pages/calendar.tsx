import CalendarView from "@/components/dashboard/CalendarView";
import { PageLayout } from "@/components/layout/PageLayout";

export default function CalendarPage() {
  return (
    <PageLayout title="Calendar View">
      <CalendarView className="h-[calc(100vh-12rem)]" />
    </PageLayout>
  );
}
