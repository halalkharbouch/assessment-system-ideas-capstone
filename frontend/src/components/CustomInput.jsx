import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomInput.css';

// Custom input component
const CustomInput = forwardRef(({ value, onClick, onChange }, ref) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    onClick={onClick}
    ref={ref}
    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 py-1 px-3 text-gray-700 leading-8"
    readOnly
  />
));

CustomInput.displayName = 'CustomInput';

export default CustomInput;
