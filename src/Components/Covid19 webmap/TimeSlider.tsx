// TimeSlider.tsx
import React, { useState, useEffect } from 'react';
import './TimeSlider.css';

interface TimeSliderProps {
  minDate: string;
  maxDate: string;
  onChange: (date: string) => void;
}

const TimeSlider: React.FC<TimeSliderProps> = ({ minDate, maxDate, onChange }) => {
  const [date, setDate] = useState(maxDate);
  
  useEffect(() => {
    setDate(maxDate);
  }, [maxDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    onChange(newDate);
  };

  return (
    <div className="time-slider-container">
      <div className="slider-header">
        <h4>Timeline Explorer</h4>
        <span className="current-date">{date}</span>
      </div>
      <input
        type="range"
        min={minDate}
        max={maxDate}
        value={date}
        onChange={handleChange}
        className="timeline-slider"
        step="1"
      />
      <div className="slider-labels">
        <span>{minDate}</span>
        <span>{maxDate}</span>
      </div>
    </div>
  );
};

export default TimeSlider;