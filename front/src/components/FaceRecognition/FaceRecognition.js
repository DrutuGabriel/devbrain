import React from 'react';
import './FaceRecognition.css';

function FaceRecognition({ imageUrl, faceBoxes }) {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        {imageUrl ? (
          <img id="inputimage" src={imageUrl} className="face-image" alt="" />
        ) : null}
        {
          faceBoxes ?
            faceBoxes.map((box,i) => (
              <div key={i} className="bounding-box" style={{
                top: box.topRow,
                bottom: box.bottomRow,
                left: box.leftCol,
                right: box.rightCol,
              }} />
            ))
          : null
        }
      </div>
    </div>
  );
}

export default FaceRecognition;
