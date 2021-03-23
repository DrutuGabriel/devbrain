import React from 'react';
import Tilt from 'react-tilt';
import './logo.css';
import { ReactComponent as ReactLogo } from './brain.svg';

function Logo() {
  return (
    <div className="ma4 mt0">
      <Tilt
        className="logo-tilt br2"
        options={{ max: 55 }}
        style={{ height: 150, width: 150 }}
      >
        <div className="Tilt-inner">
          <ReactLogo className="logo" alt="logo" />
        </div>
      </Tilt>
    </div>
  );
}

export default Logo;
