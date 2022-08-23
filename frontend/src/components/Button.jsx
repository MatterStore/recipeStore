import { Link } from "react-router-dom";

export default function Button(props) {
    return (
        <Link 
            to={props.to}
            className={`py-3 px-6 m-4 text-lg text-white rounded ${
                props.primary ?
                    `text-white bg-indigo-500`
                :
                    `rounded-lg text-indigo-900 ring-inset ring-indigo-500 ring-4`
            }`}
        >
            {props.children}
        </Link>
    );
}