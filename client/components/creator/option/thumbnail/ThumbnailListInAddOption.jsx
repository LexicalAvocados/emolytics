import React from 'react';

const ThumbnailListInAddOption = ({ onOptionClick, option }) => (
  <div className="ThumbnailListInAddOption">
    <div className="optionListEntry" onClick={onOptionClick}>
      <img src={option.thumbnail} alt=""/>
      <h4 className="closerTextLarger">{option.name}</h4>
      <p className="closerText">{option.description}</p>
    </div>
  </div>
);

export default ThumbnailListInAddOption;
