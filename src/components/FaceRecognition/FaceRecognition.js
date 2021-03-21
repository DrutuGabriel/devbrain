import React from 'react';
import './FaceRecognition.css';

function FaceRecognition({ imageUrl }) {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        {imageUrl ? (
          <img src={imageUrl} className="face-image" alt="" />
        ) : null}
      </div>
    </div>
  );
}

export default FaceRecognition;
