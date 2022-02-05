import { createContext, useContext, useState, useEffect, useRef } from "react";
import { fabric } from 'fabric';
import uploadIcon from "../images/upload.png"
import QrImage from "../images/qr.png"

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
    const uploadProfileImageRef = useRef(null);
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ isSubmit, setIsSubmit ] = useState(false);
    const [ background, setBackground ] = useState(false);
    const [ canvasObjectStatus, setCanvasObjectStatus ] = useState({});
    const [ canvas, setCanvas ] = useState('');
    const [ adminSelectedObjectDetails, setAdminSelectedObjectDetails ] = useState({});
    const [ agentSelectedObjectDetails, setAgentagentSelectedObjectDetails ] = useState({ clipPath: {}, details: {} })
    const [ objectLimits, setObjectLimits ] = useState({});
    const [ isSelectedObj, setIsSelectedObj ] = useState( false );

    useEffect(() => {
        if( !canvas ) return;

        deleteButton()
    }, [ canvas ])

    const initCanvas = ( data, isAdmin ) => {
        const canvas = new fabric.Canvas('canvas', {
            width: 355,
            height: 500,
            selection: false,
        });


        if( data ) {

            if( !isAdmin ) data = isAgentRule( data );

            if(data.backgroundImage) setBackground( true )
            
            const json = JSON.stringify( data )
            
            canvas.loadFromJSON( json, function(){ canvas.renderAll() }, function(o, obj) {
                /* After render canvas */
                if(obj.custom_type === "qrcode_container") addQrcode( canvas, QrImage, obj );
                if(obj.type === "i-text") handleObjectLimit( canvas, obj);
                if(obj.custom_type === "qrcode_container") handleObjectLimit( canvas, obj);

            });
            
        }
        
        return canvas;
        
    }

    const isAgentRule = ( data ) => {
        const pointerCursorTypes = ["circle_container", "image_container"];
        const defaultCursorTypes = ["qrcode_container"];

        let objects = data.objects.map(obj => {
            if( pointerCursorTypes.indexOf(obj.custom_type) !== -1 ) {
                obj.selectable = false;
                obj.hoverCursor = "pointer"
            }
            if( defaultCursorTypes.indexOf(obj.custom_type) !== -1 ) {
                obj.selectable = false;
                obj.hoverCursor = "auto"
            }

            return obj;
        });

        return { ...data, objects }
    }

    const handleObjectLimit = ( canvas, obj ) => {
        let nameLength = 0, qrCodeLength = 0;
        const objs = canvas.getObjects();

        if( objs.length ) {
            objs.forEach(obj => {
                if(obj.type === "i-text") nameLength++ 
                if(obj.custom_type === "qrcode_container") qrCodeLength++
            });
        }

        if( obj ) {
            // use in after render canvas.
            if(obj.type === "i-text") nameLength++ 
            if(obj.custom_type === "qrcode_container") qrCodeLength++
        }

        setObjectLimits({ nameLength, qrCodeLength })
    }

    const initEvent = ( canvas, isAdmin ) => {
        fabric.IText.prototype.onKeyDown = (function(onKeyDown) {
            return function(e) {
              if (e.keyCode == 13) canvas.discardActiveObject().renderAll();
              onKeyDown.call(this, e);
            }
        })(fabric.IText.prototype.onKeyDown)
        
        canvas.on("mouse:up", function(evt) {
            const hasBgImage = canvas.backgroundImage;
            if( !hasBgImage ) document.getElementById("uploadBackground").click();

            setIsSelectedObj( false )

            if(evt.transform?.corner === "deleteControl") {
                /* DELETE feature */
                const target = evt.transform.target
                const { custom_ref_container_id, custom_type } = evt.target;
                const [ imageContainerType, imageName ] = custom_type.split("_")
                
                canvas.getObjects().forEach(obj => {
                    // enable container onClick upload file
                    if( obj.custom_id === custom_ref_container_id && obj.type === imageContainerType ) {
                        obj["custom_is_upload"] = false;
                        obj.hoverCursor = "pointer"
                    }
                })
                
                canvas.remove(target);
                canvas.requestRenderAll();
                handleObjectLimit( canvas )
                return true;
            }


            if( isAdmin && evt.currentTarget ) {
                const { custom_type, strokeWidth, top, left, stroke } = evt.currentTarget;

                setIsSelectedObj( true )
                
                switch( custom_type ) {
                    case "circle_container": 
                        setAdminSelectedObjectDetails({ strokeWidth, top, left, stroke });
                        break;
                    case "qrcode_container": 
                        setAdminSelectedObjectDetails({ strokeWidth, top, left, stroke });
                        break;
                    default: setAdminSelectedObjectDetails({});
                }
            }
            
            if( !isAdmin && evt.currentTarget ) {
                const { custom_type, custom_id, custom_is_upload, height, width, top, left, radius, aCoords } = evt.currentTarget;
                const { x, y } = evt.currentTarget.getCenterPoint();
                
                // disable apply mouse event after upload the image for the one circle container
                if(custom_is_upload) return;
                
                /* Set ClipPath for upload image into [type]_container */
                switch( custom_type ) {
                    /**
                        @customType must same as custom_type type value
                        eg: custom_type = "iAmName_container"
                        customType === iAmName
                     */
                    case "circle_container":
                        const circleClipPath = new fabric.Circle({ radius, left, top, absolutePositioned: true });
                        const circleType = "circle";
                        setAgentagentSelectedObjectDetails({ clipPath: circleClipPath, details: { height, width, custom_id, type: circleType, x, y } })
                        uploadProfileImageRef.current.click();
                        break;
                    case "image_container":
                        const scaleWidth = evt.currentTarget.getScaledWidth();
                        const scaleHeight = evt.currentTarget.getScaledHeight();

                        const getOriginTopPosition = aCoords.tl.y;
                        
                        const imageClipPath = new fabric.Rect({ width: scaleWidth, height: scaleHeight, left, top: getOriginTopPosition, absolutePositioned: true });
                        const imageType = "image";
                        setAgentagentSelectedObjectDetails({ clipPath: imageClipPath, details: { height, width, custom_id, type: imageType, x, y } })
                        uploadProfileImageRef.current.click();
                        break;
                    case "text_container":
                        evt.target.selectAll();
                        evt.target.enterEditing();
                        break;
                    // case "qrcode_container":
                    //     console.log(""); break;
                    default:
                }
            }
        });
        
    }
    
    const deleteButton = () => {
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
    
        fabric.Object.prototype.controls.deleteControl = new fabric.Control({
          x: 0.5,
          y: -0.5,
          offsetY: -16,
          cursorStyle: 'pointer',
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

    const addName = ( ) => {
        const textName = new fabric.IText("Please key in your name", {
            fontFamily: 'helvetica',
            fontSize: 18,
            fontWeight: 600,
            fill: "#000",
            hasBorders: false,
            editable: isAdmin ? false : true,
            hasControls: true,
            cursorDuration: 500,
        });
        textName["custom_type"] = "text_container";
        textName.setControlsVisibility({ mtr: true, mt: false, mb: false, tr: false, tl: false, br: false, bl: false, ml: true, mr: true })
        
        canvas.centerObject( textName )
        canvas.add( textName )
        canvas.requestRenderAll();

        handleObjectLimit(canvas);
    }

    const addQrcode = ( canvas, qrcode, obj ) => {
        
        const { left, top, width, height } = obj;
        const clipPath = new fabric.Rect({ width, height, left, top, absolutePositioned: true })
        
        fabric.Image.fromURL(qrcode, img => {
            img.set({
                left: left + 2,
                top: top + 2,
                hasControls: false,
                selectable: false,
                hoverCursor: "auto",
                clipPath
            }, { crossOrigin: 'Anonymous' })

            img.scaleToWidth( width - 4, false )
            img["custom_type"] = "qrcode_image"

            canvas.add(img)
            canvas.requestRenderAll();
        })
    }

    return {
        initCanvas,
        initEvent,
        setCanvas,
        canvas,
        setIsAdmin,
        isAdmin,
        background,
        setBackground,
        setIsSubmit,
        isSubmit,
        setCanvasObjectStatus,
        canvasObjectStatus,
        clearCanvas,
        addName,
        uploadProfileImageRef,
        agentSelectedObjectDetails,
        setAdminSelectedObjectDetails,
        adminSelectedObjectDetails,
        handleObjectLimit,
        objectLimits,
        setIsSelectedObj,
        isSelectedObj,
        addQrcode
    }
}