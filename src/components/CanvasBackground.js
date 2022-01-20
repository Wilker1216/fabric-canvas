import React from 'react'
import { useFabric } from '../context/FabricContext'

const CanvasBackground = ({ setIsSubmit }) => {
	const  { selectedCanvasDetail, setSelectedCanvasDetail, agentInfo, clearCanvas, canvas, addQrcode, addName } = useFabric();
	
	const onClickBg = ( e ) => {
		const id = e.target.id;
		if( selectedCanvasDetail.id == id ) return;

		const selectedObj = agentInfo.canvasDetails.filter( obj => obj.id == id );
		clearCanvas();
		
		// load default value of the canvas
		if ( selectedObj[0].qrcodeBase64?.length ) addQrcode( canvas, selectedObj[0].qrcodeBase64 )
    if ( selectedObj[0].name?.length ) addName( canvas, selectedObj[0].name )
		
		setIsSubmit(false)
		setSelectedCanvasDetail( ...selectedObj )
	}

	return (
		<div>
			<h4>Backgrounds</h4>
			<div>
				{
					agentInfo.canvasDetails?.map((item, i) => (
						<img key={item.id} onClick={ onClickBg } className='bg-image cursor-pointer' id={item.id} src={ item.background } alt={`background_${ item.id }`} />
					))
				}
			</div>
		</div>
	)
}

export default CanvasBackground
