import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageLink, faceBox}) => {
  return(
    <div className="center ma">
      <div id='imgwrapper' className='absolute mt2'>
        <img id='inputimg' className='pa3' alt='' src={imageLink} width='500px' height='auto' />
      </div>
    </div>
  );
}

export default FaceRecognition;
