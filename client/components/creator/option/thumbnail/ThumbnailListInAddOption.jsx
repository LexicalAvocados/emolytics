import React from 'react';
import {Button, Row, Col} from 'react-bootstrap';

const ThumbnailListInAddOption = ({ onOptionClick, option }) => (
  <div className="ThumbnailListInAddOption optionListEntry" onClick={onOptionClick} style={containerStyle}>
    <img className="thumbnailImg" src={option.thumbnail} alt="" style={newOptionThumbnailStyle}/>
    <h4 className="closerTextLarger">{option.name}</h4>
    <p className="closerText">{option.description}</p>
  </div>
);

const newOptionThumbnailStyle = {
  height: '10vh',
  width: '14vh'
};

const containerStyle = {
  height: '100%',
  width: '100%'
};

export default ThumbnailListInAddOption;

