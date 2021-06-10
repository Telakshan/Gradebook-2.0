import React from "react";
import Link from "next/link";
import styles from "./Dropdown.module.scss";

const Dropdown = () => {
  return (
    <div className={styles.cartDropDown}>
      <Link href="/login">Log in</Link>

      <Link href="/register">Register</Link>

      <Link href="/help">Help</Link>

      <Link href="/">Info</Link>
    </div>
  );
};

export default Dropdown;