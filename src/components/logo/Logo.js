import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import binoculars from './binoculars.png';

const Logo = () => {
  return(
    <div className='ma4 mt0'>
      <Tilt className="Tilt pa3 br2 shadow-2" options={{ max : 70, perspective: 1000 }} style={{ height: 150, width: 150 }} >
        <div className="Tilt-inner pa4">
          <img src={binoculars} alt='logo'/>
        </div>
      </Tilt>
    </div>
  );
}


export default Logo;
