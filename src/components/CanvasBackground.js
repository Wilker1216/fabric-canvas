import React, { useEffect } from 'react'
import { fabric } from 'fabric';
import { useFabric } from '../context/FabricContext'

const CanvasBackground = ({ canvasDetails }) => {
	
	const { canvas, setBackground } = useFabric();

	const uploadBackground = ( e ) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = function (event) {
      const base64 = event.target.result;

      fabric.Image.fromURL( base64, function( img ){
        img.set({
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height
        })

				canvas.defaultCursor = "default"
        canvas.setBackgroundImage(img);
        canvas.requestRenderAll();
      })
    }

    reader.readAsDataURL(file);
		setBackground( true )
  }

	return (
	  <label>
			Upload Background
			<input onChange={ uploadBackground } type="file" id="uploadBackground" name="uploadBackground" />
		</label>
	)
}

export default CanvasBackground
