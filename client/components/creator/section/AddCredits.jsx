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
      <div>
        <h3>Add Credits To Option</h3>
        <Form onSubmit={this.props.submitCredits} horizontal>
          <Row>
            <Col sm={3}>
              <p>Credits available: {this.props.credits}</p>
            </Col>
          </Row>
          <FormGroup controlId="amount">
            <Row>
              <Col sm={2}>
                Total:
              </Col>
              <Col sm={2}>
                <FormControl type="number" placeholder="eg. 200" onChange={this.props.updateTotal}/>
              </Col>
            </Row>
            <Row>
              <Col sm={2}>
                Per View:
              </Col>
              <Col sm={2}>
                <FormControl type="number" placeholder="eg. 20" onChange={this.props.updatePerView}/>
              </Col>
            </Row>
            <Row>
              {this.props.notEnoughCredits ? (
                <p style={errorStyle}> Your account balance is too low - either add points in 'Account', or add
                    no more than {this.props.credits} credits to this option.
                </p>
              ) : ''}
            </Row>
            <Button type="submit">Add</Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
}



export default AddCredits;
