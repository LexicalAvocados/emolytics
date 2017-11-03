import React from 'react';

const Demographics = (props) => {

  const calcAvgAge = (userObjArray) => {
    var totalAge = userObjArray.reduce((acc, curr) => {return acc += (+curr.age || 0)}, 0);
    return Math.floor(10 * totalAge / userObjArray.length)/10;
  }

  const calcGenderDistribution = (userObjArray) => {
    console.log(props)
    let totalMale = userObjArray.reduce((acc, curr) => {if (curr.sex === 'Male') acc++; return acc; }, 0);
    let totalFemale = userObjArray.reduce((acc, curr) => {if (curr.sex === 'Female') acc++; return acc; }, 0);
    let malePerc = Math.floor(10*(totalMale / (totalMale + totalFemale))*100)/10
    let femalePerc = Math.floor(10*(100 - malePerc))/10;
    let output = `${totalMale}M/${totalFemale}F (${malePerc}%/${femalePerc}%)`;
    return output;
  }

  return (
    <div className="testerDetails">
      <div className="optionTitle">
        <h4> <small> Demographics </small> </h4>
      </div>
      <hr/>
        <div className='allUsers'>
          <p> Selected: All Viewers ({props.demographic.total})</p>
          <div className='averages'>
            <p> Avg Age: {parseFloat(props.demographic.age).toFixed(2)}</p>
            <p> Gender Distribution: {`${props.demographic.male}M/${props.demographic.total - props.demographic.male}F (${(props.demographic.male/props.demographic.total*100).toFixed(2)}%/${((props.demographic.total-props.demographic.male)/props.demographic.total *100).toFixed(2)}%)`}</p>
          </div>
        </div>
      <hr style={hrStyle}/>
    </div>
  )
};

const hrStyle = {
  // width: '75%'
}

export default Demographics;
