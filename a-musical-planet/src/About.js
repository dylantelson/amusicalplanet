import React, { useEffect } from "react";
import "./About.scss";

const About = ({ setShowGlobe }) => {
  
  useEffect(() => {
    setShowGlobe(true);
  }, []);

  return (
    <div id="About">
      <h1>About</h1>
      <div id="AboutText">
        <p>
          PLACEHOLDER
        </p>
      </div>
    </div>
  );
};

export default About;
