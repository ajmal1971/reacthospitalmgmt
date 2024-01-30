/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { useId } from "react";
import { Calendar } from 'primereact/calendar';

function PRCalendar ({label, calendarVal, setCalendarVal, ...props}, ref) {
    const calendarId = useId();

    return (
        <div className="w-full">
            <label htmlFor={calendarId} className='block text-gray-700 text-lg font-bold mb-2'>{label}</label>
            <Calendar ref={ref} id={calendarId} value={calendarVal} onChange={(e) => setCalendarVal(e.value)} showIcon placeholder="Select Date" dateFormat="dd-M-y" {...props} />
        </div>
    );
}

const calendarComponent = React.forwardRef(PRCalendar);

export default calendarComponent;