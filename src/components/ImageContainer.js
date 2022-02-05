import React from 'react';
import { fabric } from 'fabric';
import { useFabric } from '../context/FabricContext'
// 69.5 0.5 324.5 0.5 324.5 363.5 254.5 433.5 0.5 433.5 0.5 70.5 69.5 0.5

const ImageContainer = () => {

  const { canvas } = useFabric();

  const handleCustomFileLoader = ( e ) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = function (event) {
      const base64 = event.target.result;
      fabric.Image.fromURL( base64, function( img ){
        let oImg = img.set({
          originY: 'center',
          objectCaching: false,
        }, { crossOrigin: 'Anonymous' });

        oImg.scaleToWidth(300, false)
				canvas.defaultCursor = "auto"

        const objs = canvas.getObjects().filter(obj => obj["custom_type"] === "image_container");
        oImg["custom_type"] = "image_container";
        oImg["custom_id"] = objs.length + 1;

        canvas.centerObject( oImg )
        canvas.add( oImg )
        
        canvas.requestRenderAll();
      })
    }

    reader.readAsDataURL(file);
  }
  
  return (
    <div>
      <label>Upload Custom Image Container: </label>
      <input onChange={ handleCustomFileLoader } type="file" name="image_container" />
    </div>
  )
};

export default ImageContainer;
