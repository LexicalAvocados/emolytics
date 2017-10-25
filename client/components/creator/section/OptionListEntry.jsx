import React from 'react';
import {Link} from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';
import OptionData from './OptionData.jsx';
import AddOption from '../create/addOption.jsx';

class OptionListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      date: '',
      showAddOption: false
    };
    this.revealAddOption = this.revealAddOption.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    axios.get('/api/getTestersForOption', { params: { optionId: this.props.option.id }})
      .then((testerIds) => {
        this.props.concatTesters(testerIds.data, this.props.index);
      })
      .catch((err) => {
        console.log('Error retrieving testers for option', err);
      });
  }

  revealAddOption() {
    this.setState({
      showAddOption: !this.state.showAddOption
    });
  }

  render() {
    return (
      <div>
        { this.props.option !== 'End'  ? (
          <div className="currentSectionOptionListEntry" onClick={() => this.props.onOptionClick(this.props.index)}>
            <div className="optionListEntry">
              <img src={this.props.option.thumbnail} alt=""/>
              <p className="closerText">{this.props.option.name}</p>
              <p className="closerText">{this.props.option.description}</p>
              {/* <p>Created On: {this.state.date = new Date(this.props.option.createdAt.slice(0, 19)).toString().slice(0, 24)}</p> */}
            </div>
            {/* <OptionData data={this.props.optionData}/> */}
            {/* <Button onClick={() => this.props.deleteOption(this.props.option.id)}>Delete</Button> */}
          </div>
        ) : (
          <div onClick={this.revealAddOption} className="currentSectionOptionListEntry">
            <div className="optionListEntry">
              <h1>+</h1> {/* Style this later */}
              <Modal bsSize="large" show={this.state.showAddOption} onHide={this.revealAddOption}>
                <Modal.Header closeButton>
                  <Modal.Title>Add an Option</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <AddOption
                    close={this.revealAddOption}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.revealAddOption}>Close</Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default OptionListEntry;
