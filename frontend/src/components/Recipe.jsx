import { Link } from "react-router-dom";

export default function Recipe(props) {
    return (
        <div>
            <Link to={`/recipe/${props.id}`}>
                <h3>{props.title}</h3>
            </Link>
        </div>
    );
}