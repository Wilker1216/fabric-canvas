import React from 'react'
import { fabric } from 'fabric';
import { useFabric } from '../context/FabricContext'

const InputProfile = () => {
  const { selectedCanvasDetail, setSelectedCanvasDetail, setCanvasObjectStatus, canvasObjectStatus, canvas } = useFabric();

  const addIntoCanvas = ( base64) => {
     fabric.Image.fromURL( base64, img => {
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
      oImg["customType"] = "profile";
      oImg["status"] = true;

      canvas.add(oImg)
      canvas.requestRenderAll()
    });
  }

  const onChangeProfile = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = function (event) {
      const base64 = event.target.result;

      addIntoCanvas( base64 );
      setCanvasObjectStatus({ ...canvasObjectStatus, profile: true });
    }
    setSelectedCanvasDetail( selectedCanvasDetail )
    reader.readAsDataURL(file);
  }

  if ( canvasObjectStatus.profile ) return null;

  return (
    <input onChange={onChangeProfile} type="file" id="profile" />
  )
}

export default InputProfile
