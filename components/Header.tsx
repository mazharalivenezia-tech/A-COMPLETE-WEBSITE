
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import type { NavLink as NavLinkType } from '../types';
import SearchOverlay from './SearchOverlay';
import { useCart } from '../context/CartContext';

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CartIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ProfileIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DashboardIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const MenuIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const DesktopSubmenu: React.FC<{ link: NavLinkType; level: number, activeClass: string, inactiveClass: string }> = ({ link, level, activeClass, inactiveClass }) => {
    if (!link.children) return null;

    const menuClasses = level === 1
      ? "absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-10"
      : `absolute top-0 left-full ml-1 w-56 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover/level${level}:opacity-100 invisible group-hover/level${level}:visible transition-all duration-300`;
    
    const groupClass = `group/level${level + 1}`;
    
    return (
        <div className={menuClasses}>
            {link.children.map((child) => 
                !child.children ? (
                     <NavLink
                        key={child.name}
                        to={child.path}
                        className={({ isActive }) => `block px-4 py-2 text-sm transition-colors hover:bg-gray-100 ${isActive ? activeClass : inactiveClass}`}
                    >
                        {child.name}
                    </NavLink>
                ) : (
                    <div key={child.name} className={`${groupClass} relative`}>
                        <NavLink
                            to={child.path}
                            className={({isActive}) => `w-full flex justify-between items-center px-4 py-2 text-sm transition-colors hover:bg-gray-100 ${isActive ? activeClass : inactiveClass}`}
                        >
                            <span>{child.name}</span>
                            <ChevronRightIcon />
                        </NavLink>
                        {/* Recursion for deeper levels */}
                        <DesktopSubmenu link={child} level={level + 1} activeClass={activeClass} inactiveClass={inactiveClass} />
                    </div>
                )
            )}
        </div>
    )
}


const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openL1Menu, setOpenL1Menu] = useState<string | null>(null);
  const [openL2Menu, setOpenL2Menu] = useState<string | null>(null);
  const [openL3Menu, setOpenL3Menu] = useState<string | null>(null);
  const { totalItems } = useCart();

  const activeLinkClass = 'text-primary';
  const inactiveLinkClass = 'text-gray-600';

  const handleL1Toggle = (name: string) => {
    const newOpenMenu = openL1Menu === name ? null : name;
    setOpenL1Menu(newOpenMenu);
    if (newOpenMenu !== openL1Menu) {
      setOpenL2Menu(null);
      setOpenL3Menu(null);
    }
  };
  
  const handleL2Toggle = (name: string) => {
    const newOpenMenu = openL2Menu === name ? null : name;
    setOpenL2Menu(newOpenMenu);
     if (newOpenMenu !== openL2Menu) {
      setOpenL3Menu(null);
    }
  };
  
  const handleL3Toggle = (name: string) => {
    setOpenL3Menu(openL3Menu === name ? null : name);
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
                Faskicks Sports
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:space-x-8">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.name} className="relative group">
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center text-sm font-medium transition-colors hover:text-primary ${isActive ? activeLinkClass : inactiveLinkClass}`
                      }
                    >
                      {link.name}
                      <ChevronDownIcon className="ml-1 group-hover:rotate-180" />
                    </NavLink>
                    <DesktopSubmenu link={link} level={1} activeClass={activeLinkClass} inactiveClass={inactiveLinkClass} />
                  </div>
                ) : (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-primary ${isActive ? activeLinkClass : inactiveLinkClass}`
                    }
                  >
                    {link.name}
                  </NavLink>
                )
              )}
            </nav>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-600 hover:text-primary"
                aria-label="Open search"
                >
                <SearchIcon />
              </button>
              <Link to="/cart" className="relative text-gray-600 hover:text-primary" title="Shopping Cart">
                <CartIcon />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-primary" title="User Profile">
                <ProfileIcon />
              </Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-primary" title="Admin Dashboard">
                <DashboardIcon />
              </Link>
              <div className="lg:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-primary" aria-label="Toggle mobile menu" aria-expanded={isMenuOpen}>
                  {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`lg:hidden bg-white border-t transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[calc(100vh-5rem)]' : 'max-h-0 overflow-hidden'}`}>
            <nav className={`flex flex-col px-2 py-3 h-full overflow-y-auto ${isMenuOpen ? 'visible' : 'invisible'}`}>
              {NAV_LINKS.map((link) => (
                !link.children ? (
                  <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-100 hover:text-primary ${isActive ? 'bg-blue-50 text-primary' : 'text-gray-600'}`
                      }
                    >
                      {link.name}
                    </NavLink>
                ) : (
                  <div key={link.name} className="py-1">
                      <div className="flex items-center justify-between rounded-md hover:bg-gray-100">
                          <NavLink
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex-grow px-3 py-2 text-base font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-gray-600'}`
                            }
                          >
                            {link.name}
                          </NavLink>
                          <button 
                              onClick={() => handleL1Toggle(link.name)}
                              className="p-2 mr-1"
                              aria-expanded={openL1Menu === link.name}
                              aria-controls={`mobile-l1-${link.name.replace(/\s+/g, '-')}`}
                          >
                            <ChevronDownIcon className={`${openL1Menu === link.name ? 'rotate-180' : ''}`} />
                          </button>
                      </div>
                      <div 
                        id={`mobile-l1-${link.name.replace(/\s+/g, '-')}`}
                        className={`pl-4 overflow-hidden transition-all duration-500 ease-in-out ${openL1Menu === link.name ? 'max-h-[1000px]' : 'max-h-0'}`}
                      >
                          <div className="pt-1 flex flex-col space-y-1">
                              {link.children.map(child => (
                                  !child.children ? (
                                      <NavLink
                                          key={child.name}
                                          to={child.path}
                                          onClick={() => setIsMenuOpen(false)}
                                          className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-100 hover:text-primary ${isActive ? 'bg-blue-50 text-primary' : 'text-gray-600'}`}
                                      >
                                          {child.name}
                                      </NavLink>
                                  ) : (
                                      <div key={child.name} className="py-1">
                                          <div className="flex items-center justify-between rounded-md hover:bg-gray-100">
                                              <NavLink
                                                  to={child.path}
                                                  onClick={() => setIsMenuOpen(false)}
                                                  className={({ isActive }) => `flex-grow px-3 py-2 text-base font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-gray-600'}`}
                                              >
                                                  {child.name}
                                              </NavLink>
                                              <button 
                                                  onClick={() => handleL2Toggle(child.name)}
                                                  className="p-2 mr-1"
                                                  aria-expanded={openL2Menu === child.name}
                                                  aria-controls={`mobile-l2-${child.name.replace(/\s+/g, '-')}`}
                                              >
                                                  <ChevronDownIcon className={`${openL2Menu === child.name ? 'rotate-180' : ''}`} />
                                              </button>
                                          </div>
                                          <div 
                                            id={`mobile-l2-${child.name.replace(/\s+/g, '-')}`}
                                            className={`pl-4 overflow-hidden transition-all duration-500 ease-in-out ${openL2Menu === child.name ? 'max-h-[1000px]' : 'max-h-0'}`}
                                          >
                                              <div className="pt-1 flex flex-col space-y-1">
                                                  {child.children.map(grandchild => (
                                                      !grandchild.children ? (
                                                          <NavLink
                                                              key={grandchild.name}
                                                              to={grandchild.path}
                                                              onClick={() => setIsMenuOpen(false)}
                                                              className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-100 hover:text-primary ${isActive ? 'bg-blue-50 text-primary' : 'text-gray-600'}`}
                                                          >
                                                              {grandchild.name}
                                                          </NavLink>
                                                      ) : (
                                                          <div key={grandchild.name} className="py-1">
                                                              <div className="flex items-center justify-between rounded-md hover:bg-gray-100">
                                                                  <NavLink
                                                                      to={grandchild.path}
                                                                      onClick={() => setIsMenuOpen(false)}
                                                                      className={({ isActive }) => `flex-grow px-3 py-2 text-base font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-gray-600'}`}
                                                                  >
                                                                      {grandchild.name}
                                                                  </NavLink>
                                                                  <button
                                                                      onClick={() => handleL3Toggle(grandchild.name)}
                                                                      className="p-2 mr-1"
                                                                      aria-expanded={openL3Menu === grandchild.name}
                                                                      aria-controls={`mobile-l3-${grandchild.name.replace(/\s+/g, '-')}`}
                                                                  >
                                                                      <ChevronDownIcon className={`${openL3Menu === grandchild.name ? 'rotate-180' : ''}`} />
                                                                  </button>
                                                              </div>
                                                              <div 
                                                                id={`mobile-l3-${grandchild.name.replace(/\s+/g, '-')}`}
                                                                className={`pl-4 overflow-hidden transition-all duration-500 ease-in-out ${openL3Menu === grandchild.name ? 'max-h-[1000px]' : 'max-h-0'}`}
                                                              >
                                                                  <div className="pt-1 flex flex-col space-y-1">
                                                                      {grandchild.children.map(greatGrandchild => (
                                                                          <NavLink
                                                                              key={greatGrandchild.name}
                                                                              to={greatGrandchild.path}
                                                                              onClick={() => setIsMenuOpen(false)}
                                                                              className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-100 hover:text-primary ${isActive ? 'bg-blue-50 text-primary' : 'text-gray-600'}`}
                                                                          >
                                                                              {greatGrandchild.name}
                                                                          </NavLink>
                                                                      ))}
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      )
                                                  ))}
                                              </div>
                                          </div>
                                      </div>
                                  )
                              ))}
                          </div>
                      </div>
                  </div>
                )
              ))}
            </nav>
          </div>
      </header>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
