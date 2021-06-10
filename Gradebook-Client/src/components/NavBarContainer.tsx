import React from "react";
import NavBar from "./NavBar";
import Wrapper, { WrapperVariant } from "./Wrapper";

interface NavBarContainerProps {
  variant?: WrapperVariant;
}

const NavBarContainer: React.FC<NavBarContainerProps> = ({
  children,
  variant,
}) => {
  return (
    <>
      <NavBar />

      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default NavBarContainer;
