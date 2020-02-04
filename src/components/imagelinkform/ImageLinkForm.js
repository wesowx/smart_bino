import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onClick, onInputChange}) => {
  return(
    <div>
      <p className='f3 white'>
        {'This Magic Binoculars will detect faces in your pictures!'}
      </p>
      <div className='center'>
        <div className='pa4 br3 shadow-5 center form'>
          <input onChange= {onInputChange} id= 'userinput' className='f4 pa2 w-70 center' type='text'/>
          <button onClick={onClick} className='w-30 grow f3 link ph3 pv2 dib bg-light-purple white b ba b--gray'>
            Detect
          </button>
        </div>
      </div>
    </div>
  );
}


export default ImageLinkForm;
