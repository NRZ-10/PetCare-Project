import React from 'react';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * AvailabilitySelector - Allows selecting multiple days of the week.
 * Props:
 *   selectedDays: Array of strings representing selected days
 *   onChange: Callback function receiving the new array of selected days
 */
const AvailabilitySelector = ({ selectedDays = [], onChange }) => {
    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            onChange(selectedDays.filter(d => d !== day));
        } else {
            onChange([...selectedDays, day]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                    <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                            isSelected
                                ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50'
                        }`}
                    >
                        {day}
                    </button>
                );
            })}
        </div>
    );
};

export default AvailabilitySelector;
