import { Link } from 'react-router-dom';

export default function DeleteButton(props) {
  return (
    <Link
      to={props.to}
      onClick={props.onClick}
      className={`py-1 px-1 mx-2 my-1 text-xs text-white text-center rounded-md whitespace-nowrap select-none ${
        props.primary
          ? `text-white bg-indigo-600 hover:bg-indigo-700`
          : `text-indigo-900 ring-inset ring-indigo-400 ring-2 hover:bg-indigo-100`
      } ${props.className}`}>
      {props.children}
    </Link>
  );
}
