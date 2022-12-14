import { useState } from 'react';

export default function FloatingMenuParent(props) {
  const [open, setOpen] = useState(false);

  return (
    <span
      tabIndex={0}
      className={`relative rounded-full select-none hover:gray-900 ${props.className}`}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}>
      <span
        className={`relative text-3xl top-[-0.5ex] px-2 text-gray-700 rounded-md whitespace-nowrap select-none hover:gray-900 ${props.className}`}>
        {props.label}
      </span>
      {open ? props.children : null}
    </span>
  );
}
