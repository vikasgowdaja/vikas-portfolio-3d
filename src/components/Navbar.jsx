import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";

const themeOptions = [
  { value: "rainbow-night", label: "Black Rainbow" },
  { value: "vscode-dark-plus", label: "Dark+" },
  { value: "vscode-monokai", label: "Monokai" },
  { value: "vscode-light-plus", label: "Light+" },
];

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("rainbow-night");
  const location = useLocation();

  const applyTheme = (nextTheme) => {
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("portfolio-theme", nextTheme);
    window.dispatchEvent(new CustomEvent("portfolio-theme-change", { detail: { theme: nextTheme } }));
    setTheme(nextTheme);
  };

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("portfolio-theme") || "rainbow-night";
    applyTheme(storedTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-primary" : "bg-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <Link
          to='/'
          className='flex items-center gap-2'
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt='logo' className='w-9 h-9 object-contain' />
          <p className='text-white text-[18px] font-bold cursor-pointer flex '>
            Vikas Gowda &nbsp;
            <span className='sm:block hidden'> | Full Stack Developer</span>
          </p>
        </Link>

        <div className='hidden sm:flex items-center gap-6'>
          <ul className='list-none flex flex-row gap-8'>
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`${
                  location.pathname === nav.path ? "text-white-100" : "text-secondary"
                } hover:text-white-100 text-[18px] font-medium cursor-pointer`}
              >
                <Link to={nav.path}>{nav.title}</Link>
              </li>
            ))}
          </ul>

          <select
            value={theme}
            onChange={(event) => applyTheme(event.target.value)}
            className='bg-tertiary text-white-100 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none'
            aria-label='Select theme'
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <img
            src={toggle ? close : menu}
            alt='menu'
            className='w-[28px] h-[28px] object-contain'
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
              <li className='w-full'>
                <select
                  value={theme}
                  onChange={(event) => applyTheme(event.target.value)}
                  className='w-full bg-tertiary text-white-100 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none'
                  aria-label='Select theme'
                >
                  {themeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </li>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] ${
                    location.pathname === nav.path ? "text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                  }}
                >
                  <Link to={nav.path}>{nav.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
