import React from 'react';
import { useFabric } from '../context/FabricContext';

const DetailsBox = () => {
  const { adminSelectedObjectDetails, setAdminSelectedObjectDetails, canvas, isSelectedObj } = useFabric();
  
  const onChangeDetailBox = ( e ) => {
    let { name, value, } = e.target;
    const activeObject = canvas.getActiveObject();

    if( name === "strokeWidth" ) value = Number(value);
    
    activeObject.set(name, value);
    
    setAdminSelectedObjectDetails({ ...adminSelectedObjectDetails, [name]: value })
    canvas.requestRenderAll();
  }
  
  if( !Object.keys( adminSelectedObjectDetails ).length ) return null;
  
  return (
    <div className={`detailBox ${ !isSelectedObj ? "h-0" : "h-200"  }`}>
      <div>
        <div>
          <label>Border Width:</label>
          <input onChange={ onChangeDetailBox } value={ adminSelectedObjectDetails.strokeWidth || "" } type="range" name="strokeWidth"  min="1" max="6" />
        </div>
        <div>
          <label>Border Color:</label>
          <input onChange={ onChangeDetailBox } type="color" name="stroke" value={ adminSelectedObjectDetails.stroke || "#FFFFFF" } />
        </div>
      </div>
      <div>
        {
          Object.entries(adminSelectedObjectDetails).map(([key, value], index) => <p key={ index }>{ key }: { value }</p> )
        }
      </div>
    </div>
  )
};

export default DetailsBox;
