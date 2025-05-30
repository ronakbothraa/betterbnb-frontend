"use client";

import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { enUS } from 'date-fns/locale';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface DatePickerProps {
    value: Range,
    onChange: (value: RangeKeyDict) => void,
    BookedDates?: Date[],
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, BookedDates }) => {

    return (
        <DateRange
            onChange={onChange}
            ranges={[value]}
            date={new Date()}
            minDate={new Date()}
            rangeColors={["#262626"]}
            direction="vertical"
            showDateDisplay={false}
            className="w-full border border-gray-400 rounded-xl mb-4"
            disabledDates={BookedDates || []}
            locale={enUS}
        />
    )
}

export default DatePicker;