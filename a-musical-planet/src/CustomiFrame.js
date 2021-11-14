import React from "react";

const CustomiFrame = React.memo(({ trackId, width, height }) => {
  if (!trackId || trackId === "undefined") return null;
  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${trackId}`}
      title={`Spotify Web Player ${trackId}`}
      key={trackId}
      width={width}
      height={height}
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
    ></iframe>
  );
});

export default CustomiFrame;
