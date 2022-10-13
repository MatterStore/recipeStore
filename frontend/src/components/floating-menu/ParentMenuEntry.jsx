import { useState } from 'react';

export default function ParentMenuEntry(props) {
  const [open, setOpen] = useState(false);
  return (
    <li
      className={`p-4 hover:bg-slate-200 relative`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      {props.name}
      {open ? (
        <ul className="absolute shadow-lg rounded right-[calc(10rem+1px)] w-40 top-0 z-50 bg-slate-50 ring-1 ring-slate-300">
          {props.children}
        </ul>
      ) : null}
    </li>
  );
}
