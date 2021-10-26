import React, { useEffect } from "react";
import "./About.scss";

const About = ({ setShowGlobe }) => {
  
  //show globe, in case user just came from /play
  useEffect(() => {
    setShowGlobe(true);
  }, []);

  return (
    <div id="About">
      <h1>About</h1>
      <div id="AboutText">
        <p>
          A Musical Planet was made with the goal of helping people discover
          traditional music from around the world in a fun, interactive way.
          Most regional genres of music are in danger of being forgotten
          in favor of American influenced popular music. MORE COMING SOON
           </p>

          {/* <p>DELETE: An important thing to me when developing this website was to make it
          possible for users to not only discover new music, but learn patterns in
          how that music developed. For example, when the radio appeared in DR Congo,
          there was no infrastructure for recording studios in the country. As a result,
          they mostly played Cuban music that had retained the Congolese musical
          roots exported to Cuba many years prior in the slave trade. Inspired by this,
          the 
          </p>*/}
      </div>
    </div>
  );
};

export default About;
