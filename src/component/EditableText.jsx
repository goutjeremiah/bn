import { useState, useRef, useEffect } from 'react';// EditableText Component
function EditableText({ value, onChange, className = '' }) {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef(null);


    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    const handleBlur = () => {
        setEditing(false);
        onChange(tempValue);
    };

    return editing ? (
        <input
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            className={`border border-gray-300 rounded px-1 bg-white text-sm ${className}`}
        />
    ) : (
        <span
            className={`cursor-pointer ${className}`}
            onClick={() => setEditing(true)}
        >
            {value}
        </span>
    );
}

export default EditableText;