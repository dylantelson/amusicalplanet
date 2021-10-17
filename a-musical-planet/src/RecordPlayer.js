import React from 'react'
// import ChooseMap from "ChooseMap.scss"

const RecordPlayer = ({ map }) => {
    console.log(map.slice(0,5));
    return (
    <div className="RecordPlayerDiv">
        <img className="RecordPlayer" id={`${map}RecordPlayer`} src="mapimages/greenPlayer.png"/>
        <img className="Arm" id={`${map}Arm`} src="mapimages/greenArm.png"/>
        <img className="MapDisc" id={`${map}MapDisc`} src={`mapimages/${map.slice(0,5) === "world" ? "worldDisc.png" : (map + "Disc.png")}`}/>
        <img className="Peg" id={`${map}Peg`} src="mapimages/PEG.png"/>
    </div>
    );
}

export default RecordPlayer
