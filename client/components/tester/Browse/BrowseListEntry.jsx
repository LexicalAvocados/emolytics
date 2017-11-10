import React from 'react';
import { Link } from 'react-router-dom';
import {Button, Col, Row} from 'react-bootstrap';

const BrowseListEntry = (props) => {

  return (
    <div style={BrowseListEntryStyle} onClick={() => props.handleWatch(props.item)}>
      <Link to={'/video/'+props.item.id} style={black}>

        <Row>
          <Col md={12}>
            <img src={props.item.thumbnail} style={thumbnailStyle}></img>
          </Col>
        </Row>

        <Row>
          <h5 style={browseOptionTitleStyle}> {props.item.name} </h5>
            <Link to={'/profile:'+props.item.CrId}>
              <p style={creatorNameStyle} className='browseCreatorName'><sm>{props.item.CrName}</sm></p>
            </Link>
          <hr style={hrStyle}/>
        </Row>

        <Row>
          <Col md={8}>
            <p style={descriptionStyle}> {props.item.description} </p>
          </Col>
          <Col md={4} style={credits}>
            <a style={black}> {props.item.creditsperview} </a>
            <img src='https://image.flaticon.com/icons/svg/33/33701.svg' height={20} width={20} />
          </Col>
        </Row>
    </Link>
    </div>
  )
};

const descriptionStyle = {
  textAlign: 'left'
}

const thumbnailStyle = {
  height: '20vh',
  width: '20vw',
  textAlign: 'center'
}

const creatorNameStyle = {
  textAlign: 'left',
  marginLeft: '5%',
  color: 'black'
}

const BrowseListEntryStyle = {
  height: '34vh',
  // width: '20vw',
  // width: '85%',
  overflow: 'scroll',
  color: 'black'
  // margin: '3%'
  // backgroundColor: '#93a9c054'
  // textAlign: 'center'
}

const browseOptionTitleStyle = {
  fontWeight: 'bold',
  fontSize: '17px',
  marginLeft: '5%',
  textAlign: 'left'
}

const hrStyle = {
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
}

const black = {
  color: 'black'
}

const credits = {
  color: 'black',
  float: 'right'
}

export default BrowseListEntry
