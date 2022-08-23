import { Link } from "react-router-dom";

export default function Recipe(props) {
    return (
        <div>
            <Link to={`/recipe/${props.id}`}>
                {props.name}
            </Link>
        </div>
    );
}