import React from "react";
import "./Loaders.scss";

const Loaders = ({ width, height, thickness }) => {
  const style = {
    width: width,
    height: height,
    WebkitMask: `radial-gradient(farthest-side, #0000 calc(100% - ${thickness}), #000 0)`,
  };

  return (
    <div
      className="custom-loader"
      style={style}
    ></div>
  );
};

export default Loaders;
