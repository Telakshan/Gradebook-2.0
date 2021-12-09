import React, { useContext } from "react";
import { ApplicationContext } from "../../Hooks/ApplicationContext";
import "./About.scss";

const About: React.FC = () => {
  const { darkMode } = useContext(ApplicationContext);

  return (
    <div className={`${darkMode ? "about-dark" : "about"}`}>
      <h1>Just for fun</h1>

      <h4>
        Hope you like my dumb website. Check out the code for this project and
        many others on my{" "}
        <a target="blank" href="https://github.com/telakshan" className="link">
          {" "}
          Github{" "}
        </a>
      </h4>
    </div>
  );
};

export default About;
