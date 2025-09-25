"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,  
  EventContentArg,
} from "@fullcalendar/core";
import { notFound, useParams, useRouter } from "next/navigation";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}

const Calendar: React.FC = () => {
  const params = useParams();
  const id = params.id ? String(params.id) : null;

  const router = useRouter();
  
  if (id === null) {
    notFound();
  }

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);  

  const calendarsEvents = {
    Danger: "danger",
    Success: "success",
    Primary: "primary",
    Warning: "warning",
  };

  useEffect(() => {
    // Initialize with some events
    setEvents([
      // {
      //   id: "1",
      //   title: "Event Conf.",
      //   start: new Date().toISOString().split("T")[0],
      //   extendedProps: { calendar: "Danger" },
      // },
      // {
      //   id: "2",
      //   title: "Meeting",
      //   start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      //   extendedProps: { calendar: "Success" },
      // },
      // {
      //   id: "3",
      //   title: "Workshop",
      //   start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
      //   end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
      //   extendedProps: { calendar: "Primary" },
      // },
    ]);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {    
    const selectedDate = selectInfo.startStr;
    router.push(`/park-branches/${id}/shift-calendar/shifts?date=${selectedDate}`);
  };  

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}          
          eventContent={renderEventContent}
          // customButtons={{
          //   addEventButton: {
          //     text: "Assign Shift +",
          //     click: openModal,
          //   },
          // }}
        />
      </div>      
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
