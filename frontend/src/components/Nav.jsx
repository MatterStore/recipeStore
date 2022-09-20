import { useLocation, Link } from "react-router-dom";

export default function Nav(props) {
  const location = useLocation();
  const navigationRoutes = [
    ["Home", "/listing"],
    ["My Recipes", "/collection/Your%20Recipe%20Collection"],
    ["Sign Out", "/"],
  ];
  const doNotDisplayNavOn = ["/", "/login", "/signup"];

  if (!doNotDisplayNavOn.includes(location.pathname)) {
    return (
      <nav className="py-1 bg-blue-100 fixed w-full z-20 top-0 left-0 border-b border-blue-100 min-w-screen">
        <div className="container flex flex-wrap justify-between items-center mx-auto w-screen  max-w-screen-xl ">
          <p>StoreMyRecipe </p>
          <ul className="flex p-2 mt-4 flex-row space-x-8 mt-0 text-sm font-medium border-0 bg-blue-100">
            {navigationRoutes.map(([title, path]) => (
              <li key={path}>
                <Link
                  to={`${path}`}
                  className={`${
                    location.pathname === path ||
                    location.pathname === path + "/"
                      ? `block py-2 pr-4 pl-3 rounded bg-blue-200 text-blue-500 p-0 `
                      : `block py-2 pr-4 pl-3 text-blue-700 rounded hover:text-blue-700 p-0 dark:hover:text-white text-neutral-600 `
                  }`}
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
}
