import React from 'react';

import HomeIcon from '@material-ui/icons/Home';
import HostAppActions from './pages/host-app-actions';

const homeNavLink = { navLink: '/', label: 'Home' };

const hostAppActionsNavLink = {
  navLink: '/host-app-actions',
  label: 'Host App Actions',
};

const navLinks = [
  homeNavLink,
  hostAppActionsNavLink,
];

const homeItem = [
  {
    icon: <HomeIcon />,
    label: homeNavLink.label,
    navLink: homeNavLink.navLink,
    element: <HostAppActions />,
  },
];

const navItems = homeItem;

export { navItems, navLinks };
