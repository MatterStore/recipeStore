
import { useLocation } from 'react-router-dom'

export default function Nav(props) {
    const location = useLocation();
    const navigationRoutes = [
        ["Home", "/listing"],
        ["My Recipes", "/collection/Your%20Recipe%20Collection"],
        ["Sign Out", "/"]]
    const doNotDisplayNavOn = ["/", "/login", "/signup"]

    if (!doNotDisplayNavOn.includes(location.pathname)) {
        return (
            <nav className="py-1 bg-blue-100 fixed w-full z-20">
                <div className="px-16 p-2 flex flex-wrap container justify-between items-center mx-auto">
                    <p className="cursor-default select-none">StoreMyRecipe </p>
                    <ul className="flex flex-row space-x-8 text-sm">
                        {
                            navigationRoutes.map(([title, path]) =>
                                <li key={path}>
                                    <a
                                        href={`${path}`}
                                        className={`block py-2 px-2.5 rounded select-none transition-colors ${location.pathname === path
                                            ? `bg-blue-200 text-blue-600 p-0 `
                                            : `hover:text-blue-700 p-0 text-neutral-600 `
                                            }`}>{title}
                                    </a>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </nav>
        )
    }

}