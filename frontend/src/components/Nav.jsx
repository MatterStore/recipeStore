
import { useLocation } from 'react-router-dom'

export default function Nav(props) {
    const location = useLocation();
    const navigationRoutes = [
        ["Home", "/listing"],
        ["My Recipes", "/collection/Your%20Recipe%20Collection"],
        ["Sign Out", "/"]]
    const doNotDisplayNavOn = ["/", "/login"]

    if (!doNotDisplayNavOn.includes(location.pathname)) {
        return (
            <nav class="py-2.5 bg-blue-900 fixed w-full z-20 top-0 left-0 border-b border-blue-600">
                <div class="container flex flex-wrap justify-between items-center mx-auto">
                        <ul class="flex p-4 mt-4 flex-row space-x-8 mt-0 text-sm font-medium border-0 bg-blue-900">
                            {
                                navigationRoutes.map(([title, path]) =>
                                    <li>
                                        <a href={`${path}`}
                                            class={`${location.pathname === path
                                                ? `block py-2 pr-4 pl-3 rounded bg-transparent text-blue-700 p-0 `
                                                : `block py-2 pr-4 pl-3 text-blue-700 rounded hover:text-blue-700 p-0 dark:hover:text-white text-blue-400 `
                                                }`}
                                            aria-current="page">{title}
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