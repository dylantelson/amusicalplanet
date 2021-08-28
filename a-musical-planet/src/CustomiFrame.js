import React from "react";

const CustomiFrame = React.memo(({ src, width, height }) => {
  console.log("RENDERING IFRAME");
  return (
    <iframe
      src={src}
      width={width}
      height={height}
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
    ></iframe>
  );
});

export default CustomiFrame;
