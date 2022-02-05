import React, { useEffect, useState } from 'react'
import { useFabric } from '../context/FabricContext'
import { fabric } from 'fabric';

const CLIP_PATHS = [
  { id: 1, top: 92, left: 72, positionY: 138, positionX: 72 },
  { id: 2, top: 92, left: 207, positionY: 138, positionX: 207 },
  { id: 3, top: 210, left: 72, positionY: 255, positionX: 72 },
  { id: 4, top: 210, left: 207, positionY: 256, positionX: 207 },
  { id: 5, top: 325, left: 70, positionY: 370, positionX: 70 },
]

const Avatar = () => {
  const { setCanvasObjectStatus, canvasObjectStatus, canvas } = useFabric();
  const [ avatarClipPaths, setAvatarClipPaths ] = useState();

  useEffect(() => {
    setAvatarClipPaths( CLIP_PATHS )
  }, [])

  // console.log(`canvasObjectStatus in avatar: `, canvasObjectStatus)
  const addIntoCanvas = ( base64 ) => {
    fabric.Image.fromURL( base64, img => {

    let getAvatarLength = 0, getCurrentClipPathIndex; 
    const ids = canvas.getObjects()
                        .filter( obj => obj["customType"] === "avatar")
                        .map( obj => obj["avatar_id"])
    let selectedClipPathObj = avatarClipPaths.filter( obj => {
      return ids.indexOf( obj.id ) === -1
    }).sort((a, b) => a.avatar_id - b.avatar_id)[0].id
    console.log("selectedClipPathObj ", selectedClipPathObj)

    canvas.getObjects().forEach(( obj ) => {
      if( obj["customType"] !== "avatar") return;
      getAvatarLength++
    });

    const { top, left, positionY, positionX, id }  = avatarClipPaths[ selectedClipPathObj - 1 ]
    const clipPath = new fabric.Circle({ radius: 50, top, left, absolutePositioned: true })

    let oImg = img.set({
      left: positionX,
      top: positionY,
      originY: 'center',
      clipPath,
      objectCaching: false,
    }, { crossOrigin: 'Anonymous' }).scale(0.2);

     oImg.scaleToWidth(90, false)
     oImg["customType"] = "avatar";
     oImg["status"] = CLIP_PATHS.length - 1 === getAvatarLength;
     oImg["avatar_id"] = id

     canvas.add(oImg)
     canvas.requestRenderAll()
   });
 }
  
  const onChangeAvatar = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.addEventListener('error', () => {
      console.error(`Error occurred reading file `);
    });

    reader.addEventListener('load', ( event ) => {
      const base64 = event.target.result;
      
      addIntoCanvas( base64 );
      setCanvasObjectStatus( canvasObjectStatus );
    });

    // setSelectedCanvasDetail( selectedCanvasDetail )
    reader.readAsDataURL( file );
  }
  
  if( canvasObjectStatus.avatar || canvasObjectStatus.avatar === undefined ) return null;
  
  return (
    <label className={``}>
      Add Avatar
      <input onChange={ onChangeAvatar } type="file" alt="Upload Avatar" id="avatar" />
  </label>
  )
}

export default Avatar
