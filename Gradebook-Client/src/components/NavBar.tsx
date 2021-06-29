import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./NavBar.module.scss";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { Box } from "@chakra-ui/react";
import { isServer } from "../pages/utils/isServer";
import { IoIosLaptop } from "react-icons/io";
import NextLink from "next/link";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [, logout] = useLogoutMutation();
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
        <Box className={styles.email}>{data.me.username}</Box>

        <Box className={styles.placeholder}></Box>

        <div className={styles.upload}>
          <div className={styles.host}>
            <Button
              onClick={async () => {
                await logout();
                router.reload();
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
        <IoIosLaptop className={styles.logo} />

        <NextLink href="/">
          <h4 className={styles.text}>Gradebook</h4>
        </NextLink>
      </div>
      <div className={styles.searchBox}></div>
      {body}
    </div>
  );
};

export default NavBar;
