import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo/logo_simples.png'
import { Avatar, Popover, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons'


function Navbar() {

  const [click, setClick] = useState(false);
  const [dashboardLink, setDashboardButton] = useState();
  const [dashboardeditorLink, setDashboardEditorButton] = useState();
  const [signUpLink, setSignUpButton] = useState();
  const [signInLink, setSignInButton] = useState();
  const [signOutLink, setSignOutButton] = useState();
  const [MobilesignUpLink, setMobileSignUpButton] = useState(true);
  const [MobilesignInLink, setMobileSignInButton] = useState(true);
  const [MobilesignOutLink, setMobileSignOutButton] = useState();
  const [reservesLink, setReservesButton] = useState();
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const [userLogged, setUserLogged] = useState();
  const [favoritesLink, setFavoritesButton] = useState();

  const onClickLogout = () => {
    fetch('/auth/logout', {
      headers: { 'Accept': 'application/json' }
    })

      .then((response) => response.json())

      .then((response) => {
        if (response.logout) {

          localStorage.removeItem('idUser');
          setUserLogged(false);
          window.location.reload(false);
        }
      })

      .catch(() => {
        localStorage.removeItem('idUser');
        setUserLogged(false);
      })
  }

  useEffect(() => {

    fetch('/auth/me', {
      headers: { 'Accept': 'application/json' }
    })

      .then((response) => response.json())

      .then((response) => {
        //se scope do utilizador for == ao scope q tem permissão pra ver button
        setUserLogged(response.auth);
        //console.log("stuff: " + response.auth);
        console.log("scopes: " + response.decoded);

        function showButtons() {
          if (window.innerWidth <= 960) {
            setSignInButton(false);
            setSignUpButton(false);
            setSignOutButton(false);
            if (response.auth) {
              setMobileSignInButton(false);
              setMobileSignUpButton(false);
              setMobileSignOutButton(true);
            } else {
              setMobileSignInButton(true);
              setMobileSignUpButton(true);
              setMobileSignOutButton(false);
            }
          } else {
            if (response.auth) {
              setSignInButton(false);
              setSignUpButton(false);
              setSignOutButton(true);
            } else {
              setSignInButton(true);
              setSignUpButton(true);
              setSignOutButton(false);
            }
          }
        }
        
        window.addEventListener('resize', showButtons);
        window.addEventListener('load', showButtons);

        if (response.decoded[2] == 'undefined') {

          setDashboardButton(false);
          setDashboardEditorButton(false);
          setReservesButton(false);
          setFavoritesButton(false);
          showButtons();
          localStorage.removeItem('idUser');
          console.log("guest");


        } else if (response.decoded[2] == 'user') {

          setDashboardButton(false);
          setDashboardEditorButton(false);
          setReservesButton(true);
          setFavoritesButton(true);
          showButtons();
          console.log("user");


        } else if (response.decoded[2] == 'admin') {

          setDashboardButton(true);
          setDashboardEditorButton(false);
          setReservesButton(false);
          setFavoritesButton(false);
          showButtons();
          console.log("admin");


        } else if (response.decoded[2] == 'editor') {

          setDashboardButton(false);
          
          setDashboardEditorButton(true);
          setReservesButton(false);
          setFavoritesButton(false);
          showButtons();
          console.log("editor");


        } else {
          localStorage.removeItem('idUser');
          setDashboardButton(false);
          setDashboardEditorButton(false);
          setReservesButton(false);
          setFavoritesButton(false);
          showButtons();
          console.log("guest");
        }
      })

      .catch(() => {
        localStorage.removeItem('idUser');
        setUserLogged(false);
        console.log("try catch");
      })
  }, [])


  if (!userLogged) {
    localStorage.removeItem('idUser');
  }

  //console.log("passei aqui", dashboardeditorLink)

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            <img className='Logo' src={logo} />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>

            <li data-testid="rooms" className='nav-item'>
              <Link to='/roomList'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Rooms
              </Link>
            </li>

            {reservesLink &&
              <li data-testid="myreserves" className='nav-item'>
                <Link to='/myreserves'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  My Reserves
                </Link>
              </li>}

            {favoritesLink &&
              <li data-testid="myfavorites" className='nav-item'>
                <Link to='/myfavorites'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  My Favorite Rooms
                </Link>
              </li>}

            {dashboardLink &&
              <li data-testid="dashboard" className='nav-item'>
                <Link to='/dashboard'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </li>}
            {dashboardeditorLink &&
              <li data-testid="dashboardEditor" className='nav-item'>
                <Link to='/dashboardeditor'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              </li>}
            {MobilesignUpLink &&
              <li data-testid="register">
                <Link
                  to='/register'
                  className='nav-links-mobile'
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </li>
            }
            {MobilesignInLink &&
              <li data-testid="login">
                <Link
                  to='/login'
                  className='nav-links-mobile'
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
              </li>
            }
            {MobilesignOutLink &&
              <li data-testid="logout">
                <Link
                  to='/'
                  className='nav-links-mobile'
                  onClick={closeMobileMenu, onClickLogout}
                >
                  Sign Out
                </Link>
              </li>
            }
          </ul>


          {signUpLink &&
            <Link data-testid="register" to='/register' className='btn-mobile'>
              <Button buttonStyle='btn--gold--outline'>SIGN UP</Button>
            </Link>}

          {signInLink &&
            <Link data-testid="login" to='/login' className='btn-mobile'>
              <Button buttonStyle='btn--gold--outline'>SIGN IN</Button>
            </Link>}

          {signOutLink &&
            <div data-testid="logout" className='btn-mobile'>
              <Popover placement="bottom" color={"#242424"} align='middle' content={
                <>
                  <Row justify='center' style={{ marginBottom: -8 }}>
                    <Link to="" onClick={onClickLogout}><p style={{ color: '#fff' }}>Log Out</p></Link>
                  </Row>
                </>
              } trigger="click">
                <Avatar size={60} icon={<UserOutlined />} />
              </Popover>

            </div>
          }
        </div>
      </nav>
    </>
  );
}

export default Navbar;