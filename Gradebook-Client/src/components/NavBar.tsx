import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./NavBar.module.scss";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { Box } from "@chakra-ui/react";
import { isServer } from "../pages/utils/isServer";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.pageYOffset;

    offset > 20 ? setScrolled(true) : setScrolled(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });

  let body = null;

  if (fetching) {
    body = null;
} else if (!data?.me) {
    body = (
      <>
        <div className={styles.upload}>
          <div className={styles.host}>
            <Link href="/login">Log in</Link>
          </div>
        </div>
        <div className={styles.upload}>
          <div className={styles.host}>
            <Link href="/register">Register</Link>
          </div>
        </div>
      </>
    );
  } else {
    body = (
      <>
        <Box className={styles.email}>
          <Box>{data.me.username}</Box>
        </Box>

        <Box className={styles.placeholder}></Box>

        <div className={styles.upload}>
          <div className={styles.host}>
            <Button
              onClick={async () => {
                await logout();
                router.push("/");
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={`${styles.navigationContainer} ${
        scrolled ? styles.scrolled : null
      }`}
    >
      <div className={styles.title}>
        <Link href="/">
          <h4 className={styles.text}>Gradebook</h4>
        </Link>
      </div>
      <div className={styles.searchBox}></div>
      {body}
    </div>
  );
};

export default NavBar;
