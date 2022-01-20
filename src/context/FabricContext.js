import { createContext, useContext, useState, useEffect } from "react";
import { fabric } from 'fabric';

const FabricContext = createContext();

export const FabricProdivder = (props) => {
    const canvas = useFabricProvider();

    return (
        <FabricContext.Provider value={canvas}>{props.children}</FabricContext.Provider>
    )
}

export const useFabric = () => {
    return useContext(FabricContext)
}

const useFabricProvider = () => {
    const [agentInfo, setAgentInfo] = useState({});
    const [selectedCanvasDetail, setSelectedCanvasDetail] = useState({});
    const [isSubmit, setIsSubmit] = useState(false)
    const [agentName, setAgentName] = useState("");
    const [canvas, setCanvas] = useState('');

    useEffect(() => {
        initEvents( )
    }, [ canvas ])
    
    const initEvents = () => {
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = 'blue';
        fabric.Object.prototype.cornerStyle = 'circle';
        
        customDeleteIcon()
    }
    
    const customDeleteIcon = () => {
        const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
        let img = document.createElement("img")
        img.src = deleteIcon;
    
        function renderIcon(ctx, left, top, styleOverride, fabricObject) {
          var size = this.cornerSize;
          ctx.save();
          ctx.translate(left, top);
          ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
          ctx.drawImage(img, -size / 2, -size / 2, size, size);
          ctx.restore();
        }
    
        const deleteObject = (eventData, transform) => {
          var target = transform.target;
          var canvas = target.canvas;
          switch( target.customType ) {
            case "profile":
              setSelectedCanvasDetail({ ...selectedCanvasDetail, profileStatus: false });
              setIsSubmit(false);
              break;
            case "avatar":
              setSelectedCanvasDetail({ ...selectedCanvasDetail, avatarIsFull: false }); break;
            default: console.log("Didn't updated")
          }
          
          
          canvas.remove(target);
          canvas.requestRenderAll();
        }
    
        fabric.Object.prototype.controls.deleteControl = new fabric.Control({
          x: 0.5,
          y: -0.5,
          offsetY: -16,
          cursorStyle: 'pointer',
          mouseUpHandler: deleteObject,
          render: renderIcon,
          cornerSize: 24
        });
    }
    
    const clearCanvas = ( removes ) => {
        canvas.getObjects().forEach(obj => {
            if (obj === canvas.backgroundImage) return;
            canvas.remove(obj)
        })
    }

    const loadFromJson = () => {
        canvas.loadFromJSON(selectedCanvasDetail.json, function() {
            const allObjects = canvas.getObjects().map(obj => {
                return obj
            })
        })
        setIsSubmit(false)
        canvas.renderAll();
    }

    const addName = ( canvas, name ) => {
        if ( !name.length ) return;

        const clipPath = new fabric.Rect({ width: 20, height: 200, left: 250, top: 130, absolutePositioned: true });
        const textName = new fabric.IText( name, {
            fontFamily: 'helvetica',
            fontSize: 20,
            fontWeight: 600,
            fill: "#000",
            top: 130,
            left: 270,
            angle: 90,
            hasBorders: false,
            editable: false,
            hasControls: true,
            cursorDuration: 500,
            clipPath
        });
        textName.setControlsVisibility({ mtr: false, mt: false, mb: false, tr: false, tl: false, br: false, bl: false, ml: true, mr: true })
        textName["customType"] = "name";
        
        setAgentName( textName )
        canvas.add( textName )
        canvas.requestRenderAll();
    }

    const addQrcode = ( canvas, qrcode ) => {
        const clipPath = new fabric.Rect({ width: 90, height: 90, left: 250, top: 340, absolutePositioned: true })

        fabric.Image.fromURL(qrcode, img => {
            img.set({
                left: 250,
                top: 340,
                hasControls: false,
                selectable: false,
                hoverCursor: "auto",
                clipPath
            }, { crossOrigin: 'Anonymous' })

            img.scaleToWidth(95, false)
            img["customType"] = "qrcode"
            canvas.add(img)
            canvas.requestRenderAll();
        })
    }

    return {
        setSelectedCanvasDetail,
        setAgentInfo,
        setCanvas,
        setIsSubmit,
        setAgentName,
        clearCanvas,
        addQrcode,
        addName,
        selectedCanvasDetail,
        agentInfo,
        isSubmit,
        loadFromJson,
        canvas
    }
}