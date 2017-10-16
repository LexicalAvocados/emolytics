import React from 'react';

const Demographics = (props) => {

  const calcAvgAge = (userObjArray) => {
    var totalAge = userObjArray.reduce((acc, curr) => {return acc += (+curr.age || 0)}, 0);
    return totalAge / userObjArray.length;
  }

  const calcGenderDistribution = (userObjArray) => {
    let totalMale = userObjArray.reduce((acc, curr) => {if (curr.sex === 'Male') acc++; return acc; }, 0);
    let totalFemale = userObjArray.reduce((acc, curr) => {if (curr.sex === 'Female') acc++; return acc; }, 0);
    let malePerc = Math.floor(10*(totalMale / (totalMale + totalFemale))*100)/10
    let femalePerc = Math.floor(10*(100 - malePerc))/10;
    let output = `${totalMale}M/${totalFemale}F (${malePerc}%/${femalePerc}%)`;
    return output;
  }

  return (
    <div className="testerDetails">
      <h3> Demographics </h3>
      {props.selectedUsers.length < props.allUsers.length ? (
        <div className='specificUsers'>

          <div className='userDetails'>
            {props.selectedUsers.map((userObj, i) => (
              <p key={i}> {userObj.name || userObj.username } (sex: {userObj.sex || 'N/A'}, age: {userObj.age || 'N/A'})</p>
            ))}
          </div>

          <div className='averages'>
            <p> Avg Age: {calcAvgAge(props.selectedUsers)}</p>
            <p> Gender Distribution: {calcGenderDistribution(props.selectedUsers)}</p>
          </div>

        </div>
      ): (
        <div className='allUsers'>
          <p> All Users</p>
          <div className='averages'>
            <p> Avg Age: {calcAvgAge(props.selectedUsers)}</p>
            <p> Gender Distribution: {calcGenderDistribution(props.selectedUsers)}</p>
          </div>
        </div>
      )}
      <hr/>
    </div>
  )
};

export default Demographics;
