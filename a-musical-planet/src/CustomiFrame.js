import React from "react";

const CustomiFrame = React.memo(({ src, width, height }) => {
  if(!src) return null;
  return (
    <iframe
      src={src}
      title={`Spotify Web Player ${src}`}
      key={src}
      width={width}
      height={height}
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
    ></iframe>
  );
});

export default CustomiFrame;
