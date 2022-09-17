
import { useLocation } from 'react-router-dom'

export default function Nav(props) {
    const location = useLocation();
    console.log(location.pathname);

    if (location.pathname != "/" && location.pathname != "/login") {
    return (
        <nav class="bg-white px-2 sm:px-4 py-2.5 dark:bg-blue-900 fixed w-full z-20 top-0 left-0 border-b border-blue-200 dark:border-blue-600">
            <div class="container flex flex-wrap justify-between items-center mx-auto">
                <div class="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul class="flex flex-col p-4 mt-4 bg-blue-50 rounded-lg border border-blue-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-blue-800 md:dark:bg-blue-900 dark:border-blue-700">
                        <li>
                            <a href="/listing" 
                            class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="/collection/Your%20Recipe%20Collection" 
                            class="block py-2 pr-4 pl-3 text-blue-700 rounded hover:bg-blue-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-blue-400 dark:hover:bg-blue-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-blue-700">My Recipes</a>
                        </li>
                        <li>
                            <a href="/" 
                            class="block py-2 pr-4 pl-3 text-blue-700 rounded hover:bg-blue-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-blue-400 dark:hover:bg-blue-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-blue-700">Sign Out</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
    }

}