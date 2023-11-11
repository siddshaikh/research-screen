import React from "react";
import { Resizable } from "react-resizable";

const ResizableColumn = ({ label, width, onResize }) => {
  return (
    <Resizable
      width={width}
      height={0}
      handle={<span className="react-resizable-handle" />}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <div>{label}</div>
    </Resizable>
  );
};

export default ResizableColumn;
