import React from "react";

import CustomiFrame from "./CustomiFrame";

import getMixedColor from "./GetMixedColor";

const SummaryItem = ({ countryInfo, index, show }) => {
  // console.log(countryInfo.correct);
  return (
    <div
      className={"summaryItem" + (!show ? " hidden" : "")}
      style={{ background: `#${getMixedColor(countryInfo.score / 5000)}` }}
    >
      <div className="summaryItemHeader">
        <div className="summaryItemHeaderName">
          <h3>
            Round {index + 1}: {countryInfo.country}
          </h3>
          <img
            src={"/flags/" + countryInfo.code + ".svg"}
            alt={countryInfo.country + " flag"}
          />
        </div>
        <h3>(+{countryInfo.score})</h3>
      </div>
      <CustomiFrame
        src={`https://open.spotify.com/embed/track/${countryInfo.songId}`}
        width="90%"
        height="80"
      />
    </div>
  );
};

export default SummaryItem;
