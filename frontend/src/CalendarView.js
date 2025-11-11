import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { parseISO, format, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const DnDCalendar = withDragAndDrop(Calendar);

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({ format, parse: (str, fmt) => parseISO(str), startOfWeek, getDay, locales });

const categoryColors = {
  work: '#4285f4',
  personal: '#34a853',
  deadline: '#ea4335',
  meeting: '#fbbc04',
  default: '#9e9e9e'
};

function CalendarView({ events, onSelectEvent, onSelectSlot, onEventDrop }) {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const mapped = events.map(ev => ({
    id: ev.id,
    title: ev.title,
    start: parseISO(ev.start_time),
    end: parseISO(ev.end_time),
    allDay: false,
    resource: ev,
  }));

  const eventPropGetter = (event) => {
    const category = event.resource.category || 'default';
    const backgroundColor = categoryColors[category.toLowerCase()] || categoryColors.default;
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div style={{ height: 'calc(100vh - 120px)', margin: '0' }}>
      <DnDCalendar
        localizer={localizer}
        events={mapped}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        views={["month", "week", "day"]}
        style={{ height: '100%' }}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        onEventDrop={onEventDrop}
        selectable
        resizable
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
}

export default CalendarView;
