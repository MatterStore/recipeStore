import { Link } from "react-router-dom";

export default function Button(props) {
    return (
        <Link to={props.to}>{props.children}</Link>
    );
}