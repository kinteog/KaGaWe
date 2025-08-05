import React, { useRef, useState, useEffect, useContext } from 'react';
import { Container, Row, Button } from 'reactstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { AuthContext } from '../../context/AuthContext';
import { FaChevronDown } from 'react-icons/fa';
import '../Header/header.css'; // Reuse main header styles

const admin_dropdowns = [
  {
    label: 'Services & Products',
    subItems: [
      { path: '/admin/ecufiles', label: 'ECU Files' },
      { path: '/admin/services', label: 'Services' },
      { path: '/admin/spareparts', label: 'Spare Parts' },
    ]
  },
  {
    label: 'Orders & Bookings',
    subItems: [
      { path: '/admin/ecufiles-orders', label: 'ECU File Orders' },
      { path: '/admin/sparepart-orders', label: 'Spare Part Orders' },
      { path: '/admin/service-bookings', label: 'Service Bookings' },
    ]
  },
  {
    path: '/admin/users',
    label: 'Users',
  },
  {
    path: '/admin/reviews',
    label: 'Reviews',
  },
];


const AdminNavbar = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const [openDropdown, setOpenDropdown] = useState(null);


  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const stickyHeaderFunc = () => {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky_header');
      } else {
        headerRef.current.classList.remove('sticky_header');
      }
    });
  };

  useEffect(() => {
    stickyHeaderFunc();
    return () => window.removeEventListener('scroll', stickyHeaderFunc);
  }, []);

  const toggleMenu = () => {
    menuRef.current.classList.toggle('show__menu');
    setOpenDropdown(null); 
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav_wrapper d-flex align-items-center justify-content-between">

            {/* Logo */}
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>

            {/* Navigation */}
            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <ul className="menu d-flex align-items-center gap-5">
                  {admin_dropdowns.map((item, index) => (
                    item.subItems ? (
                      <li className="nav_item dropdown" key={index}>
                      <span
                        className="dropdown-toggle d-flex align-items-center"
                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={(e) => {
                          e.stopPropagation(); // prevent parent click
                          setOpenDropdown(openDropdown === index ? null : index);
                        }}
                      >
                        {item.label}
                        <FaChevronDown size={16} className="ms-1 dropdown-arrow" />
                      </span>



                        <ul className={`dropdown-menu ${openDropdown === index ? 'show' : ''}`}>
                          {item.subItems.map((sub, subIdx) => (
                            <li key={subIdx}>
                              <NavLink
                                to={sub.path}
                                className={(navClass) => navClass.isActive ? 'active_link' : ''}
                              >
                                {sub.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li className="nav_item" key={index}>
                        <NavLink
                          to={item.path}
                          className={(navClass) => navClass.isActive ? 'active_link' : ''}
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    )
                  ))}


                {/* Username Styled Like Other Menu Items */}
                {user && (
                  <li className="nav_item">
                    <NavLink
                      to="/profile"
                      className={(navClass) =>
                        navClass.isActive ? 'active_link' : ''
                      }
                    >
                      {user.username}
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>

            {/* Logout Button */}
            <div className="nav_right d-flex align-items-center gap-4">
              {user && (
                <Button className="btn btn-dark" onClick={logout}>
                  Logout
                </Button>
              )}
              <span className="mobile_menu" onClick={toggleMenu}>
                <i className="ri-menu-line"></i>
              </span>
            </div>

          </div>
        </Row>
      </Container>
    </header>
  );
};

export default AdminNavbar;
