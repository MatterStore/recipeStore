import { Link } from "react-router-dom";

export default function Recipe(props) {
  return (
    <Link
      to={`/recipe/${props._id}`}
      className={`w-96 h-64 bg-gray-200 mr-4 mb-4 rounded p-8 inline-block text-xl`}
    >
      {props.title}
      <img
        src={props.primaryImage}
        alt=""
        className="object-cover w-full max-h-full pb-12 mt-4 rounded"
      />
    </Link>
  );
}
