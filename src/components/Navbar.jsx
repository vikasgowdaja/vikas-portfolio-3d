import React, { useEffect, useRef, useState } from "react";
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

const ThemeMenu = ({ theme, onChange, fullWidth = false }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const activeTheme = themeOptions.find((option) => option.value === theme) || themeOptions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className={`relative ${fullWidth ? "w-full" : "w-[182px]"}`}>
      <button
        type='button'
        onClick={() => setOpen((current) => !current)}
        aria-haspopup='menu'
        aria-expanded={open}
        className={`w-full group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
          open
            ? "bg-tertiary/95 text-white-100 ring-1 ring-white/30"
            : "bg-tertiary/80 text-white-100 hover:bg-tertiary ring-1 ring-white/15 hover:ring-white/25"
        } backdrop-blur-md`}
      >
        <span className='tracking-[0.01em]'>{activeTheme.label}</span>
        <span className={`text-[10px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-full overflow-hidden rounded-xl border border-white/15 bg-black-100/95 backdrop-blur-xl shadow-[0_18px_44px_rgba(0,0,0,0.35)] z-40'>
          {themeOptions.map((option) => {
            const isActive = option.value === theme;

            return (
              <button
                key={option.value}
                type='button'
                role='menuitemradio'
                aria-checked={isActive}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-[15px] transition-colors ${
                  isActive
                    ? "bg-white/15 text-white-100"
                    : "text-secondary hover:text-white-100 hover:bg-white/10"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

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

          <ThemeMenu theme={theme} onChange={applyTheme} />
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
                <ThemeMenu theme={theme} onChange={applyTheme} fullWidth />
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
