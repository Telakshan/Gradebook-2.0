import React from "react";
import NextLink from "next/link";
import styles from "./Dropdown.module.scss";

const Dropdown = () => {
  return (
    <div className={styles.cartDropDown}>
      <NextLink href="/login">Log in</NextLink>

      <NextLink href="/register">Register</NextLink>

      <NextLink href="/help">Help</NextLink>

      <NextLink href="/">Info</NextLink>
    </div>
  );
};

export default Dropdown;
