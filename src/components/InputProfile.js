import React from 'react'
import { fabric } from 'fabric';
import { useFabric } from '../context/FabricContext'

const InputProfile = () => {
  const { currentAgentInfo, setCurrentAgentInfo,  canvas, clearCanvas } = useFabric();

  const addIntoCanvas = ( base64) => {
     fabric.Image.fromURL( base64, img => {
      const clipPath = new fabric.Rect({ width: 180, height: 250, left: 50, top: 133, absolutePositioned: true });
      // const clipPath = new fabric.Polygon([
      //   { x: 69.5, y: 0.5 },
      //   { x: 324.5, y: 0.5 },
      //   { x: 324.5, y: 363.5 },
      //   { x: 254.5, y: 433.5 },
      //   { x: 0.5, y: 433.5 },
      //   { x: 0.5, y: 70.5 },
      //   { x: 69.5, y: 0.5 },
      // ], {
      //   selectable: false,
      //   width: 100,
      //   height: 50,
      //   left: 48,
      //   top: 133,
      //   fill: '#000',
      //   absolutePositioned: true
      // })
      const canvCenter = canvas.getCenter();
      var oImg = img.set({
        left: 50,
        top: canvCenter.top + 5,
        originY: 'center',
        clipPath,
        objectCaching: false,
      }, { crossOrigin: 'Anonymous' });

      oImg.scaleToWidth(180, false)
      oImg["customType"] = "profile"
      // oImg.setControlsVisibility({ mtr: false })

      canvas.add(oImg)
      canvas.requestRenderAll()
    });
  }

  const onChangeProfile = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = function (event) {
      const base64 = event.target.result;

      addIntoCanvas(base64)
    }
    setCurrentAgentInfo({ ...currentAgentInfo, profileStatus: true })
    reader.readAsDataURL(file);
  }

  if (currentAgentInfo.profileStatus || currentAgentInfo.profileStatus === undefined) return null;

  return (
    <input onChange={onChangeProfile} type="file" id="profile" />
  )
}

export default InputProfile
