import React from "react";

import CustomiFrame from "./CustomiFrame";

const SummaryItem = ({ countryInfo, index }) => {
  console.log(countryInfo.correct);
  return (
    <div
      className={
        "summary-item" + (!countryInfo.correct ? " incorrect-background" : "")
      }
    >
      <div className="summaryItemHeader">
        <h3>
          Round {index + 1}: {countryInfo.country}
        </h3>
        <img
          src={"/flags/" + countryInfo.code + ".svg"}
          alt={countryInfo.country + " flag"}
        />
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
