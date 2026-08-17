import React, {} from 'react';
import { Calendar, Clock, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ScheduledEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "stream" | "meeting" | "reminder" | "other";
  participants?: number;
}

interface ScheduleCalendarProps {
  events?: ScheduledEvent[];
  onEventClick?: (eventId: string) => void;
  onViewAll?: () => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  events: propEvents,
  onEventClick,
  onViewAll
}) => {
  const defaultEvents: ScheduledEvent[] = [
    {
      id: "1",
      title: "Live Stream - Gaming Session",
      date: "2026-06-08",
      time: "18:00",
      type: "stream",
      participants: 234
    },
    {
      id: "2",
      title: "Team Meeting - Product Review",
      date: "2026-06-09",
      time: "10:00",
      type: "meeting",
      participants: 8
    },
    {
      id: "3",
      title: "Content Upload Reminder",
      date: "2026-06-10",
      time: "14:00",
      type: "reminder"
    }
  ];

  const events = propEvents || defaultEvents;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stream":
        return "bg-purple-500";
      case "meeting":
        return "bg-blue-500";
      case "reminder":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Schedule
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onEventClick?.(event.id)} role="button" tabIndex={0}
            >
              <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(event.type)}`} />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{event.title}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </div>
                  {event.participants && (
                    <Badge variant="secondary" className="text-xs">
                      {event.participants} attending
                    </Badge>
                  )}
                </div>
              </div>
              <Bell className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;
