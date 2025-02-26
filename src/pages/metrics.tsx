import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";
import { PageLayout } from "@/components/layout/PageLayout";

export default function MetricsPage() {
  return (
    <PageLayout title="Performance Metrics">
      <PerformanceMetrics className="h-[calc(100vh-12rem)]" />
    </PageLayout>
  );
}
