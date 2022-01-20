import './App.css';
import { useEffect, useState } from "react";
import { fabric } from 'fabric';
import { jsPDF } from "jspdf";

import CanvasBackground from "./components/CanvasBackground";
import InputProfile from './components/InputProfile';
import { useFabric } from "./context/FabricContext";

import BACKGROUND_1 from "./images/sample_1.jpeg"
import BACKGROUND_2 from "./images/sample_2.jpeg"
import BACKGROUND_3 from "./images/sample_3.jpeg"
import BACKGROUND_4 from "./images/sample_4.jpeg"
import QrCodeSample from "./images/qr.png"
import Avatar from './components/Avatar';


import SAMPLE_JSON from "./sample_save_as.json" // From server

let AGENT_INFO = { // default demo use
  agentId: 155,
  canvasDetails: [
    { id: 1, background: BACKGROUND_1, json: "", qrcodeBase64: QrCodeSample, profileStatus: false, name: 'Wilker' },
    { id: 2, background: BACKGROUND_2, json: "", qrcodeBase64: "" },
    { id: 3, background: BACKGROUND_3, json: "", qrcodeBase64: QrCodeSample },
    { id: 4, background: BACKGROUND_4, json: "", qrcodeBase64: "", avatarIsFull: false, avatars: [] }
  ],
}

const App = () => {
  const { selectedCanvasDetail, setSelectedCanvasDetail, canvas, setCanvas, addQrcode, agentInfo, setAgentInfo, addName, loadFromJson, setIsSubmit, isSubmit } = useFabric();

  useEffect(() => {
    const canvas = new fabric.Canvas('canvas', {
      width: 355,
      height: 500,
      selection: false,
    });
    
    // Call API & set value into state
    const defaultCanvasShow = AGENT_INFO.canvasDetails[0]
    setCanvas( canvas )
    setAgentInfo( AGENT_INFO )
    setSelectedCanvasDetail( defaultCanvasShow )

    if ( defaultCanvasShow.qrcodeBase64.length ) addQrcode( canvas, defaultCanvasShow.qrcodeBase64 )
    if ( defaultCanvasShow.name.length ) addName( canvas, defaultCanvasShow.name )
  }, [])

  useEffect(() => {
    if (!selectedCanvasDetail.id) return;

    // if already saved in database
    if (selectedCanvasDetail.json.objects?.length) return loadFromJson();

    const initCanvasBackground = () => {
      fabric.Image.fromURL(selectedCanvasDetail.background, img => {
        canvas.backgroundImage = img;
        img.scaleToHeight(500)
        canvas.renderAll();
      }, { crossOrigin: 'Anonymous' })
    }
    
    initCanvasBackground();
  }, [selectedCanvasDetail])

  const exportAsPdf = async ( e ) => {
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

    const tmp = JSON.parse(JSON.stringify(selectedCanvasDetail));
    tmp.json = canvas.toJSON([ "customType", "selectable", "mtr", "_controlsVisibility" ]);
    if( !tmp.json.objects?.length ) return alert("Something went wrong")

    const newAgentInfo = agentInfo.canvasDetails.map( obj => obj.id === selectedCanvasDetail.id ? { ...tmp } : obj )
    const DATA = { agentId: agentInfo.agentId, canvasDetails: newAgentInfo }

    try {
      setIsSubmit(true)
      const res = await fetch("url", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(DATA)
      })
    } catch (error) {
      setIsSubmit(false)
      alert("Failed to submit")
    }
  }

  return (
    <div className="App">
      <div className="features">
        <CanvasBackground setIsSubmit={setIsSubmit} />
        <div>
          <InputProfile />
          <Avatar />
        </div>
      </div>

      <div>
        <canvas id="canvas" />
      </div>

      <div className="save">
        {
          !isSubmit ?
            <button onClick={handleSubmit} href="#">Submit</button> :
            <div className="exports">
              <a onClick={ exportAsImage } href="#">Save as image</a>
              <a onClick={ exportAsPdf } data-type="a4" href="#">Save as A4 pdf</a>
              <a onClick={ exportAsPdf } data-type="a5" href="#">Save as A5 pdf</a>
            </div>
        }
      </div>
    </div>
  );
}

export default App;
