import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Nav, Navbar, Spinner } from "react-bootstrap";
import { BsLightbulb, BsLightbulbOff } from "react-icons/bs";
import { useLogoutMutation, useMeQuery } from "../../generated/graphql";
import { ApplicationContext } from "../../Hooks/ApplicationContext";
import { Link } from "react-router-dom";
import "./Navigation.scss";

const Navigation: React.FC = () => {
  const { data } = useMeQuery();
  const [logout, { loading }] = useLogoutMutation();
  const wrapper = useRef<HTMLDivElement>(null);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  const { darkMode, toggleDarkMode } = useContext(ApplicationContext);

  useEffect(() => {
    if (data?.me?.username) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [data?.me?.username, logout]);

  return (
    <Navbar
      className={`${darkMode ? "dark" : "light"}`}
      expand="lg"
      sticky="top"
      ref={wrapper}
    >
      <Navbar.Brand as={Link} to="/" style={{ color: "#90cdf4" }}>
        Gradebook
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link
            as={Link}
            to="/"
            style={{ color: `${darkMode ? "#ffffff" : ""}` }}
          >
            Home
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/about"
            style={{ color: `${darkMode ? "#ffffff" : ""}` }}
          >
            About
          </Nav.Link>
        </Nav>

        <Button
          className="darkButton"
          variant="outline-primary"
          onClick={() => {
            toggleDarkMode!();
          }}
        >
          {darkMode ? <BsLightbulb /> : <BsLightbulbOff />}
        </Button>

        {loggedIn ? (
          <>
            {/* <Nav.Link
              href="#"
              style={{ color: `${darkMode ? "#ffffff" : ""}` }}
            >
              Logged in as {data?.me?.username}
            </Nav.Link> */}

            <p
              style={{ color: `${darkMode ? "#ffffff" : ""}` }}
              className="loggedIn"
            >
              Logged in as {data?.me?.username}
            </p>

            <Button onClick={handleLogout} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Log out"}
            </Button>
          </>
        ) : (
          <>
            <Nav.Link
              as={Link}
              className="fix-padding"
              to="/login"
              style={{ color: `${darkMode ? "#ffffff" : ""}` }}
            >
              Log in
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/register"
              style={{ color: `${darkMode ? "#ffffff" : ""}` }}
            >
              Register
            </Nav.Link>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
