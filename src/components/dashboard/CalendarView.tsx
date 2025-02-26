import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addDays } from "date-fns";

import { Task } from "@/lib/types";

interface CalendarViewProps {
  tasks?: Task[];
}

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const defaultTasks: Task[] = [];

const CalendarView = ({
  tasks = defaultTasks,
  className = "",
}: CalendarViewProps & { className?: string }) => {
  const today = new Date();

  // Function to get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) => new Date(task.due_date).toDateString() === date.toDateString(),
    );
  };

  // Custom day render to show tasks
  const renderDay = (day: Date) => {
    const dayTasks = getTasksForDate(day);

    if (dayTasks.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {dayTasks.map((task) => (
          <TooltipProvider key={task.id}>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-xs">{task.departments?.name || "N/A"}</p>
                  <p className="text-xs">{task.frequency}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  };

  return (
    <Card className={`p-6 bg-white ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Task Calendar</h2>
          <div className="flex gap-2">
            {Object.entries(priorityColors).map(([priority, color]) => (
              <div key={priority} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-sm capitalize">{priority}</span>
              </div>
            ))}
          </div>
        </div>

        <Calendar
          mode="single"
          selected={today}
          className="rounded-md border"
          components={{
            DayContent: ({ date }) => (
              <div className="w-full h-full">
                <div>{date.getDate()}</div>
                {renderDay(date)}
              </div>
            ),
          }}
        />
      </div>
    </Card>
  );
};

export default CalendarView;
