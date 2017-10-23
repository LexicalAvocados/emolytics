import React from 'react';

const ThumbnailListInAddOption = ({ onOptionClick, option }) => (
  <div className="ThumbnailListInAddOption">
    <div className="optionListEntry" onClick={onOptionClick}>
      <img src={option.thumbnail} alt=""/>
      <p className="closerTextLarger">Option Name: {option.name}</p>
      <p className="closerText">Option Description: {option.description}</p>
    </div>
  </div>
  );

export default ThumbnailListInAddOption;

      // {(()=>{console.log("THIS IS OPTION", option)})()}