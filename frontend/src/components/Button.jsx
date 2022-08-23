import { Link } from "react-router-dom";

export default function Button(props) {
    return (
        <Link 
            to={props.to}
            className={`py-3 px-6 m-8 ml-0 text-xl text-white rounded-md ${
                props.primary ?
                    `text-white bg-indigo-600`
                :
                    `text-indigo-900 ring-inset ring-indigo-400 ring-2`
            }`}
        >
            {props.children}
        </Link>
    );
}