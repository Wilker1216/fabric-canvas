import React from 'react'
import { useFabric } from '../context/FabricContext'
import { fabric } from 'fabric';

import DetailsBox from "./DetailsBox"

const Circle = () => {
  const { canvas, background } = useFabric();

  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 50,
      fill: '',
      stroke: '#912222',
      strokeWidth: 3
    });


    const objs = canvas.getObjects().filter(obj => obj["custom_type"] === "circle_container");
    circle["custom_type"] = "circle_container";
    circle["custom_id"] = objs.length + 1;

    circle.setControlsVisibility({ mtr: false, mt: false, mb: false, tr: true, tl: true, br: true, bl: true, ml: false, mr: false })
    canvas.centerObject( circle )
    canvas.add( circle )
    canvas.renderAll();
  }
  
  return (
    <div>
      <button disabled={ !background } onClick={ addCircle }>Circle</button>
    </div>
  )
}

export default Circle
