import React from 'react';
import { Link } from 'react-router-dom';
import {Button, Col, Row} from 'react-bootstrap';

const BrowseListEntry = (props) => {

  return (
    <div className='BrowseListItem' style={BrowseListEntryStyle} onClick={() => props.handleWatch(props.item)}>
      <Link to={'/video/'+props.item.id} style={black}>

        <Row>
          <h5 style={browseOptionTitleStyle}> {props.item.name} </h5>
          <hr style={hrStyle}/>
        </Row>

        <Row>
          <Col md={6}>

            <p> Credits: {props.item.creditsperview} </p>
            <p> {props.item.description} </p>
          </Col>
          <Col md={6}>
            <img src={props.item.thumbnail}></img>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Link to={'/cprofile:'+props.item.CrId} style={black}>
              <p><u>By: {props.item.CrName}</u></p>
            </Link>
          </Col>
        </Row>
    </Link>
    </div>
  )
};

const BrowseListEntryStyle = {
  height: '21vh',
  overflow: 'scroll',
  color: 'black',
  textAlign: 'left'
}

const browseOptionTitleStyle = {
  fontWeight: 'bold',
  fontSize: '15px',
  textAlign: 'center'
}

const hrStyle = {
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
}

const black = {
  color: 'black'
}

export default BrowseListEntry
