import React from 'react'
import { useFabric } from '../context/FabricContext'
import { fabric } from 'fabric';

const Avatar = () => {
  const { selectedCanvasDetail, setSelectedCanvasDetail, setCanvasObjectStatus, canvasObjectStatus, canvas } = useFabric();

  const addIntoCanvas = ( base64 ) => {
    fabric.Image.fromURL( base64, img => {
    // set different clipPath for that image
     const clipPath = new fabric.Rect({ width: 180, height: 250, left: 50, top: 133, absolutePositioned: true });
     const canvCenter = canvas.getCenter();
     var oImg = img.set({
       left: 50,
       top: canvCenter.top + 5,
       originY: 'center',
       clipPath,
       objectCaching: false,
     }, { crossOrigin: 'Anonymous' });

     oImg.scaleToWidth(180, false)
     oImg["customType"] = "avatar";
      // check json object it is meet max  
     oImg["status"] = true;

     canvas.add(oImg)
     canvas.requestRenderAll()
   });
 }
  
  const onChangeAvatar = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = function (event) {
      const base64 = event.target.result;

      addIntoCanvas( base64 );
      setCanvasObjectStatus( canvasObjectStatus );
    }
    setSelectedCanvasDetail( selectedCanvasDetail )
    reader.readAsDataURL(file);
  }
  
  if( canvasObjectStatus.avatar ) return null;
  
  return (
    <label className={``}>
      Add Avatar
      <input onChange={ onChangeAvatar } type="file" alt="Upload Avatar" id="avatar" />
  </label>
  )
}

export default Avatar
