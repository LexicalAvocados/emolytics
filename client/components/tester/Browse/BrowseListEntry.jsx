import React from 'react';
import { Link } from 'react-router-dom';
import {Button} from 'react-bootstrap';

const BrowseListEntry = (props) => {


  return (
    <div className='BrowseListItem' style={BrowseListEntryStyle}>
      <p> Title: {props.item.name} </p>
      <p> Credits: {props.item.creditsperview} </p>
      <p> Description: {props.item.description} </p>
      <hr/>
      <img src={props.item.thumbnail}></img>
      <br/><br/>
      <Link to={'/video/'+props.item.id}>
        <Button>Watch</Button>
      </Link>
    </div>
  )
};

const BrowseListEntryStyle = {
  border: "solid black 1px",
  borderRadius: "10px",
  padding: "15px",
  width: "20%",
  margin: '3%',
  display: 'inline-block'
}

export default BrowseListEntry
