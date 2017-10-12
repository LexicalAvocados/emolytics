import React from 'react';
import {Link} from 'react-router-dom';

const OptionList = (props) => (
  <div>
    <Link to={'/option' + props.option.id}>
      <img src={props.option.thumbnail} alt=""/>
    </Link>
  </div>
);

export default OptionList;