import React from 'react'
// import ChooseMap from "ChooseMap.scss"

const RecordPlayer = ({ map }) => {
    let color = "green";
    if(map === "worldMedium") color = "yellow";
    else if(map === "worldHard") color = "red";
    return (
    <div className="RecordPlayerDiv">
        <img className="RecordPlayer" id={`${map}RecordPlayer`} src={`mapimages/${color}Player.png`}/>
        <img className="Arm" id={`${map}Arm`} src={`mapimages/${color}Arm.png`}/>
        <img className="MapDisc" id={`${map}MapDisc`} src={`mapimages/${map.slice(0,5) === "world" ? "worldDisc.png" : (map + "Disc.png")}`}/>
        <img className="Peg" id={`${map}Peg`} src="mapimages/PEG.png"/>
    </div>
    );
}

export default RecordPlayer
