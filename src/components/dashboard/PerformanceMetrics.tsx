import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { DatePickerWithRange } from "../ui/date-picker-with-range";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { format, subDays, isWithinInterval } from "date-fns";
import { Badge } from "../ui/badge";

interface PerformanceMetricsProps {
  completionData?: {
    department: string;
    completed: number;
    total: number;
  }[];
  distributionData?: {
    department: string;
    tasks: number;
  }[];
  className?: string;
}

const defaultCompletionData = [
  { department: "Maintenance", completed: 45, total: 60 },
  { department: "Operations", completed: 30, total: 40 },
  { department: "Facilities", completed: 25, total: 35 },
  { department: "Engineering", completed: 35, total: 50 },
];

const defaultDistributionData = [
  { department: "Maintenance", tasks: 60 },
  { department: "Operations", tasks: 40 },
  { department: "Facilities", tasks: 35 },
  { department: "Engineering", tasks: 50 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  completionData = defaultCompletionData,
  distributionData = defaultDistributionData,
  className = "",
}) => {
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: subDays(new Date(), 30), to: new Date() });
  const [selectedDepartment, setSelectedDepartment] =
    React.useState<string>("all");

  const filteredData = React.useMemo(() => {
    return completionData.filter((item) => {
      const departmentMatch =
        selectedDepartment === "all" || item.department === selectedDepartment;
      return departmentMatch;
    });
  }, [completionData, selectedDepartment]);

  const complianceRate = React.useMemo(() => {
    const total = filteredData.reduce((acc, curr) => acc + curr.total, 0);
    const completed = filteredData.reduce(
      (acc, curr) => acc + curr.completed,
      0,
    );
    return total > 0 ? (completed / total) * 100 : 0;
  }, [filteredData]);

  return (
    <div
      className={`w-full h-full bg-white p-4 rounded-lg shadow-sm space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Performance Overview</h2>
          <p className="text-sm text-gray-500">
            Detailed metrics and compliance analysis
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {completionData.map((item) => (
                <SelectItem key={item.department} value={item.department}>
                  {item.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePickerWithRange value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {complianceRate.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-500">Overall Compliance Rate</p>
            <Badge
              className={
                complianceRate >= 90
                  ? "bg-green-100 text-green-800"
                  : complianceRate >= 70
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }
            >
              {complianceRate >= 90
                ? "Excellent"
                : complianceRate >= 70
                  ? "Good"
                  : "Needs Improvement"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {filteredData.reduce((acc, curr) => acc + curr.completed, 0)}
            </div>
            <p className="text-sm text-gray-500">Total Completed Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {filteredData.reduce(
                (acc, curr) => acc + (curr.total - curr.completed),
                0,
              )}
            </div>
            <p className="text-sm text-gray-500">Pending Tasks</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="completion" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="completion">Completion Rates</TabsTrigger>
          <TabsTrigger value="distribution">
            Department Distribution
          </TabsTrigger>
          <TabsTrigger value="trends">Completion Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="completion">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rates by Department</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#4CAF50" name="Completed" />
                  <Bar dataKey="total" fill="#2196F3" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Task Distribution by Department</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#FF9800" name="Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#4CAF50"
                    name="Completed"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#2196F3"
                    name="Total"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMetrics;
