import { Link } from 'react-router-dom';

export default function Button(props) {
  return (
    <Link
      to={props.to}
      onClick={props.onClick}
      className={`py-3 px-6 mx-2 my-2 text-xl text-white text-center rounded-md whitespace-nowrap select-none ${
        props.primary
          ? `text-white bg-indigo-600 hover:bg-indigo-700`
          : `text-indigo-900 ring-inset ring-indigo-400 ring-2 hover:bg-indigo-100`
      } ${props.className}`}>
      {props.children}
    </Link>
  );
}
