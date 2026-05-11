import React from "react";
import { NavLink } from "react-router-dom";
import { usePrefetch } from "../../slices/apiSlice";

import Styles from "./Nav.module.scss";

const navClass = ({ isActive }) =>
   isActive ? Styles.button_active : Styles.button;

const NAV_LINKS = [
   { to: "/", label: "Home", end: true, prefetch: "getAllPosts" },
   { to: "/universities", label: "Universities", prefetch: "getCountries" },
   { to: "/postal-lookup", label: "Postal Lookup" },
];

const Nav = () => {
   const prefetchPosts = usePrefetch("getAllPosts");
   const prefetchCountries = usePrefetch("getCountries");

   const prefetchMap = {
      getAllPosts: prefetchPosts,
      getCountries: prefetchCountries,
   };

   return (
      <div className={Styles.nav}>
         {NAV_LINKS.map(({ to, label, end, prefetch }) => (
            <NavLink
               key={to}
               to={to}
               end={end}
               className={navClass}
               onMouseEnter={
                  prefetch ? () => prefetchMap[prefetch]() : undefined
               }
            >
               {label}
            </NavLink>
         ))}
      </div>
   );
};

export default Nav;
