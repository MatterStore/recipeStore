import { Link } from "react-router-dom";

export default function Recipe(props) {
    return (
        <Link
            to={`/recipe/${props.id}`}
            className={`w-72 h-40 bg-gray-200 mr-4 mb-4 rounded p-8 inline-block text-xl`}
        >
            {props.name}
        </Link>
    );
}