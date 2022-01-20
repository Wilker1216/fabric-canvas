import React from 'react'
import { useFabric } from '../context/FabricContext'

const Avatar = () => {
  const { selectedCanvasDetail } = useFabric();

  if(selectedCanvasDetail.avatarIsFull || selectedCanvasDetail.avatarIsFull === undefined) return null;
  
  return (
    <label className={``}>
      Add Avatar
      <input type="file" alt="Upload Avatar" id="avatar" />
  </label>
  )
}

export default Avatar
