import React from 'react';
import { Link } from 'react-router-dom';
import {Button} from 'react-bootstrap';

const BrowseListEntry = (props) => {


  return (
    <div className='BrowseListItem' style={BrowseListEntryStyle}>
      <p> Name: {props.item.name} </p>
      <p> Credits: {props.item.creditsperview} </p>
      <img src={props.item.thumbnail}></img>
      <Link to={'/video/'+props.item.id}>
        <Button>Watch</Button>
      </Link>
      <br/><br/>
    </div>
  )
};

const BrowseListEntryStyle = {
  border: "solid black 1px",
  borderRadius: "10px",
  padding: "15px",
  width: "20%"
}

export default BrowseListEntry
