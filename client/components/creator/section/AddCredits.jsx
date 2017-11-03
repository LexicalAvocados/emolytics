import React from 'react';
import { Button, Modal, Form, FormGroup, FormControl, Row, Col, ControlLabel } from 'react-bootstrap';


class AddCredits extends React.Component {
  constructor(props) {
    super(props)
    this.state ={

    };
  }

  render() {
    const errorStyle = {
      textAlign: "center",
      color: "red",
      fontWeight: "bold"
    }
    return (
      <div style={leftAlign}>
        <Row style={header}>
          <Col sm={12}>
            <h3>Add Credits To Option</h3>
            <p>Credits available: {this.props.credits}</p>
          </Col>
        </Row>

        <Form onSubmit={this.props.submitCredits} horizontal>
          <FormGroup controlId="amount">
            <Row>
              <Col sm={3}>
                <p style={verticalAlign}>Total:</p>
              </Col>
              <Col sm={6}>
                <FormControl type="number" placeholder={"Balance: "+this.props.option.totalcredits} onChange={this.props.updateTotal}/>
              </Col>
            </Row>
            <Row>
              <Col sm={3}>
                <p style={verticalAlign}>Per View:</p>
              </Col>
              <Col sm={6}>
                <FormControl type="number" placeholder={"Currently: "+this.props.option.creditsperview} onChange={this.props.updatePerView}/>
              </Col>
            </Row>
            <Row>
              {this.props.notEnoughCredits ? (
                <p style={errorStyle}> Your account balance is too low - either add points in 'Account', or add
                    no more than {this.props.credits} credits to this option.
                </p>
              ) : ''}
            </Row>
            <Col sm={7}></Col>
            <Col sm={2}>
              <Button type="submit" style={right}>Add</Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

const verticalAlign = {
  // display: 'table-cell',
  // verticalAlign: 'middle'
  marginTop: '7%'
}

const header = {
  marginLeft: '-8%'
}

const right = {
  float: 'right'
}

const leftAlign = {
  textAlign: 'left'
}


export default AddCredits;
