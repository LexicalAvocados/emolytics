import React from 'react';

const Demographics = (props) => {

  return (
    <div className="testerDetails">
      <h3 className='testerNameHeader'>Viewer: {props.user.name}</h3>
      <p> Age: {props.user.age}, Sex: {props.user.sex}, Race: {props.user.race}</p>
      <hr/>
    </div>
  )
};

export default Demographics;
