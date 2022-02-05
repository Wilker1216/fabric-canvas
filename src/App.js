import './App.css';
import { useEffect } from "react";
import { jsPDF } from "jspdf";

import { useFabric } from "./context/FabricContext";
import { fabric } from 'fabric';
import CanvasBackground from './components/CanvasBackground';
import Rectangle from './components/Rectangle';
import Circle from './components/Circle';
import DetailsBox from './components/DetailsBox';
import ImageContainer from './components/ImageContainer';


import SERVER_RESPOND_JSON from './sample_save_as.json'

const App = () => {
  const { canvas, setCanvas,setIsAdmin, isAdmin, setIsSubmit, isSubmit, initCanvas, initEvent, uploadProfileImageRef, agentSelectedObjectDetails, addName, objectLimits, background, setBackground } = useFabric();

  useEffect(() => {
    const getCanvasData = async () => {
      // const res = await fetch("url");
      // const payload = await res.json();
      // return payload;

      
      const payload = null; // SERVER_RESPOND_JSON || null

      const isAdmin = true;
      
      const canvas = initCanvas( payload, isAdmin )
      setCanvas(canvas)
      
      setIsAdmin( isAdmin );
      initEvent(canvas, isAdmin)
  
      if( payload ) {
        if( payload.backgroundImage ) {
          canvas.defaultCursor = "auto";
          setBackground( true );
        }
      } else {
        canvas.defaultCursor = "pointer";
        setBackground( false );
      }
    }

    getCanvasData(); 

  }, [])
  

  const uploadProfileImage = ( e ) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = function(event) {
      const base64 = event.target.result;

      const { clipPath, details } = agentSelectedObjectDetails;

      fabric.Image.fromURL( base64, img => {
        let oImg = img.set({
          left: details.x - 25,
          top: details.y,
          originY: 'center',
          objectCaching: false,
          clipPath
        }, { crossOrigin: 'Anonymous' }).scale(0.2);

        oImg.scaleToWidth( clipPath.width / 2, true)

        oImg["custom_type"] = `${ details.type }_profile`
        oImg["custom_ref_container_id"] = details.custom_id;

        const dontSlipTypes = ["circle_container", "image_container"];
        canvas.getObjects().forEach(obj => {
          
          if( dontSlipTypes.indexOf(obj["custom_type"]) === -1 ) return;

          /* disabled container onClick upload file in Circle */
          const [containerType, name] = obj.custom_type.split("_")
          if(obj["custom_id"] === details.custom_id && containerType === details.type) {
            obj["custom_is_upload"] = true;
            obj.hoverCursor = "auto"
          }
        })

        canvas.add(oImg)
        canvas.requestRenderAll()
      })

      uploadProfileImageRef.current.value = "";
      
    }

    reader.readAsDataURL(file);
  }

  const exportAsPdf = async (e) => {
    const type = e.target.dataset.type;
    const imgData = canvas.toDataURL("image/jpeg", 1.0)
    const pdf = new jsPDF("p", "mm", type);

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, width, height)
    pdf.save('canvas.pdf')
  }

  const exportAsImage = async (e) => {
    const link = document.createElement("a");
    const href = canvas.toDataURL({ format: 'png', quality: 0.8 });
    link.href = href;
    link.download = "canvas";

    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    canvas.getObjects().forEach(obj => {
      const type = obj.custom_type;
      /* 
        insert clipPath before submit 
      */
      if( type === "text_container") {
        const {width, height, left, top, angle } = obj;
        
        const clipPath = new fabric.Rect({ width, height, left, top, angle, absolutePositioned: true });
        obj["clipPath"] = clipPath
      }
    })
    
    const customTypes = ["custom_ref_container_id", "custom_is_upload", "custom_type", "custom_id", "selectable", "mtr", "_controlsVisibility"]
    const canvasObject = canvas.toJSON( customTypes );

    try {
      setIsSubmit(true)
      console.log(canvasObject)
      console.log(JSON.stringify(canvasObject))
      console.log("------- Demo JSON Send To Server --------")
      const res = await fetch("url", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(canvasObject)
      })
    } catch (error) {
      setIsSubmit(false)
      alert("Failed to submit")
    }
  }

  return (
    <div className="App">
      <div>
        <canvas id="canvas" />
        <div className="save">
          {
            !isSubmit ?
              <button onClick={handleSubmit} href="#">Save</button> :
              <div className="exports">
                <a onClick={exportAsImage} href="#">Save as image</a>
                <a onClick={exportAsPdf} data-type="a4" href="#">Save as A4 pdf</a>
                <a onClick={exportAsPdf} data-type="a5" href="#">Save as A5 pdf</a>
              </div>
          }
        </div>
      </div>

      {
        isAdmin && (
          <div className="features">
              <CanvasBackground />
              <Circle />
              <Rectangle />
              <ImageContainer />
              <DetailsBox />
              <button disabled={ !background || objectLimits.nameLength >= 1 } onClick={ addName }>Name</button>
          </div>
        )
      }
      <input className='hidden' ref={ uploadProfileImageRef } onChange={ uploadProfileImage } type="file"  id="uploadProfileImage" name="uploadProfileImage" />
    </div>
  );
}

export default App;
