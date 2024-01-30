/* eslint-disable react/prop-types */
import React, { useId } from 'react';

const TextArea = React.forwardRef(function TextArea({ label, type = 'text', className = '', ...props }, ref) {
    const id = useId();

    return (
        <div className='w-full'>
            {label && <label className='block text-gray-700 text-lg font-bold mb-2' htmlFor={id}>{label}</label>}
            <textarea rows={4} type={type} className={`shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none ${className}`} ref={ref} {...props} id={id}></textarea>
        </div>
    );
});

export default TextArea;