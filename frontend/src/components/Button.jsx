import { Link } from "react-router-dom";

export default function Button(props) {
  return (
    <Link
      to={props.to}
      className={`py-3 px-6 m-8 ml-0 text-xl text-white text-center rounded-md whitespace-nowrap max-w-fit ${
        props.primary
          ? `text-white bg-indigo-600`
          : `text-indigo-900 ring-inset ring-indigo-400 ring-2`
      } ${props.className}`}
    >
      {props.children}
    </Link>
  );
}
