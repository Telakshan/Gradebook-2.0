import React from "react";

import styles from "./Button.module.scss";

interface ButtonProps {
  children: string;
  onClick: () => void;
  otherProps?: [x: string];
}

const Button: React.FC<ButtonProps> = ({ children, ...otherProps }) => {
  return (
    <button className={styles.button} {...otherProps}>
      {children}
    </button>
  );
};

export default Button;
