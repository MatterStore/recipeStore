import { useState, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { home, myListingRoute, publicListingRoute } from '../api/routes';
import { useAuthContext } from '../contexts/AuthContext';

import FloatingMenu from './floating-menu/FloatingMenu';
import MenuEntry from './floating-menu/MenuEntry';

export default function Nav(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const loggedIn = useMemo(
    () => authContext?.isLoggedIn && authContext?.user.id,
    [authContext]
  );
  const navigationRoutes = [['Home', publicListingRoute]];
  const doNotDisplayNavOn = ['/', '/login', '/signup'];

  loggedIn &&
    navigationRoutes.push([
      'My Recipes',
      myListingRoute,
    ]);

  if (!doNotDisplayNavOn.includes(location.pathname)) {
    return (
      <nav className="py-1 bg-blue-100 fixed w-full z-20">
        <div className="px-16 p-2 flex flex-wrap container justify-between items-center mx-auto">
          <div className="flex flex-row items-center">
            <img src="/logo.svg" className="h-8" alt="" />
            <p className="cursor-default select-none px-2">Foodify</p>
          </div>
          <ul className="flex flex-row space-x-8 text-sm">
            {navigationRoutes.map(([title, path]) => (
              <NavItem location={location} title={title} path={path} />
            ))}
            {loggedIn && (
              <li key="logout">
                <FloatingMenuParent label={'Profile'}>
                  <FloatingMenu>
                    <MenuEntry onClick={() => navigate('/')}>Log Out</MenuEntry>
                    <MenuEntry
                      onClick={() => navigate('/profile/change-password')}>
                      Change Password
                    </MenuEntry>
                  </FloatingMenu>
                </FloatingMenuParent>
              </li>
            )}
            {!loggedIn && (
              <NavItem location={location} title={'Log In'} path={home} />
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

function NavItem(props) {
  return (
    <li key={props.path}>
      <Link
        to={`${props.path}`}
        className={`block py-2 px-2.5 rounded select-none transition-colors ${
          props.location.pathname === props.path ||
          props.location.pathname === props.path + '/'
            ? `bg-blue-200 text-blue-600 p-0 `
            : `hover:text-blue-700 p-0 text-neutral-600 `
        }`}>
        {props.title}
      </Link>
    </li>
  );
}

function FloatingMenuParent(props) {
  const [open, setOpen] = useState(false);

  return (
    <span
      tabIndex={0}
      className={`relative rounded-full select-none hover:gray-900 ${props.className}`}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}>
      <span
        className={`block py-2 px-2.5 rounded select-none transition-colors hover:text-blue-700 hover:cursor-pointer p-0 text-neutral-600 ${props.className}`}>
        {props.label}
      </span>
      {open ? props.children : null}
    </span>
  );
}
