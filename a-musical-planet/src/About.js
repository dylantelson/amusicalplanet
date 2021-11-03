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
        {/* Many regional genres of music are in danger of being forgotten
        in favor of American-influenced popular music. This is one of the downsides
        of the Internet connecting all of us- we end up assimilating to the cultural superpower.
        On the other hand, the Internet allows us to listen to music from every country, no matter
        where we are, for the first time in history, making it easy for us to find great new genres. */}
        <p>
          &emsp;A Musical Planet was made with the goal of helping people discover traditional music from around
          the world in an interactive and fun way. While sifting through Spotify searching for world music,
          I kept finding great songs for every country. What disappointed me was how often some of the best
          tracks had very few listens, a symptom of how so many regional genres are being forgotten in favor
          of American-influenced mainstream music. I started thinking about how I could take all of these songs
          and build a website that would allow other people to enjoy and learn about music at risk of being forgotten.
          Inspired by <a href="https://www.geoguessr.com/" target="_blank">GeoGuessr</a>, I decided to create
          A Musical Planet, a game which plays you a random song from the thousands I've collected over the past few months,
          and gives you a simple yet addictive task: to find out what country it’s from. With just a few hours playing,
          you'll begin to learn what types of instruments and musical customs any given area has.
        </p>

        <p>
          &emsp;Knowing the music of the world isn't just about knowing a country's traditions, but also its history. Brazil
          and Angola, both having been colonized by Portugal, share many similarities in their national music, such as
          Brazilian <a href="https://www.wikipedia.org/wiki/Samba" target="_blank">Samba</a> and Angolan <a href="https://www.wikipedia.org/wiki/Semba" target="_blank">Semba</a>. Due to the lack of recording studios in DR Congo after World War II, the main
          music played on the radio was Cuban, as it retained the African musical roots exported through the slave trade.
          As a result, the local musicians took inspiration from Cuba, and the <a href="https://www.wikipedia.org/wiki/Congolese_rumba" target="_blank">Rumba</a> eventually matured into its own national
          genre, <a href="https://www.wikipedia.org/wiki/Soukous" target="_blank">Soukous</a>. If you guess the wrong country while playing, consider what similarities you had noticed- there may
          be a historical reason behind it.
        </p>
        
        <p>
          &emsp;Good luck guessing (and learning)! I hope you have as much fun playing this as I did making it.
        </p>

        <div id="extra">
          <h2>Dylan Telson</h2>
          <a id="github" href="https://github.com/dylantelson/amusicalplanet" target="_blank">Github</a>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    </div>
  );
};

export default About;
