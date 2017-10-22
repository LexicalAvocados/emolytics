import React from 'react';

const ThumbnailListInAddOption = ({ onOptionClick, option }) => (
  <div className="ThumbnailListInAddOption">
    <div className="optionListEntry" onClick={onOptionClick}>
    <img src={option.thumbnail} alt=""/>
    </div>
  </div>
  );

export default ThumbnailListInAddOption;

