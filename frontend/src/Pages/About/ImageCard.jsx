import React from 'react'
// import {images} from '../assets/assets'

const ImageCard = ({src, label, tall}) => {
  return (
    <div className={`relative overflow-hidden rounded-xl group imageCard 
      ${tall ? "h-[600px]" : "h-[290px]"}`}>

      <img
        src={src}
        alt={label}
        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 group-hover:brightness-75"
      />
      
      {/* Overlay */}
      <div className="absolute hover:inset-0 hover:bg-gray-900/20"></div>

      {/* Hover Text */}
      <div className=" absolute bottom-0 left-0 w-full bg-black/60 text-white text-sm py-3 px-4 text-center slide-up">
        {label}
      </div>
    </div>
  )
}

export default ImageCard