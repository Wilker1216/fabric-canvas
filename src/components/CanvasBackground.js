import React, { useEffect } from 'react'
import { useFabric } from '../context/FabricContext'

const CanvasBackground = ({ canvasDetails }) => {
	const  { selectedCanvasDetail, setSelectedCanvasDetail, clearCanvas, canvas, setIsSubmit, loadValueFromField } = useFabric();
	
	const onClickBg = ( e ) => {
		const id = e.target.id;
		if( selectedCanvasDetail.id == id ) return;

		const selectedObj = canvasDetails.filter( obj => obj.id == id );
		clearCanvas();

		setIsSubmit(false)
		setSelectedCanvasDetail( ...selectedObj )
		loadValueFromField( canvas, ...selectedObj )
	}
	
	if( !canvasDetails ) return <div>Loading...</div>
	
	return (
		<div>
			<h4>canvasDetails</h4>
			<div>
				{
					canvasDetails.map((item, i) => (
						<img key={item.id} onClick={ onClickBg } className='bg-image cursor-pointer' id={item.id} src={ item.background } alt={`background_${ item.id }`} />
					))
				}
			</div>
		</div>
	)
}

export default CanvasBackground
