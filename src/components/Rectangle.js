import React from 'react'
import { useFabric } from '../context/FabricContext'
import { fabric } from 'fabric';
import DetailsBox from "./DetailsBox"

const Rectangle = () => {
  const { canvas, background, objectLimits, handleObjectLimit } = useFabric();

  const addRectangle = () => {
    
    const rectangle = new fabric.Rect({
      left: 0,
      top: 0, 
      fill: "",
      width: 105,
      height: 105,
      stroke: '#00FF00',
      strokeWidth: 2
    });

    rectangle["custom_type"] = "qrcode_container";
    rectangle.setControlsVisibility({ mtr: false, mt: false, mb: false, tr: true, tl: true, br: true, bl: true, ml: false, mr: false })
    canvas.centerObject( rectangle )
    canvas.add( rectangle )
    canvas.renderAll();

    handleObjectLimit(canvas)
  }
  
  return (
    <div>
      <button disabled={ !background || objectLimits.qrCodeLength >= 1 } onClick={ addRectangle }>QR Square</button>
    </div>
  )
}

export default Rectangle
