import React from 'react';
import { Button, Col, Row, Carousel, Modal, Popover, OverlayTrigger } from 'react-bootstrap';
import BellIcon from 'react-bell-icon';
import { connect } from 'react-redux';

class SectionCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      selected: {},
      removed: {  backgroundColor: 'orange' },
      prev: -1
    };
    this.highlightSelected = this.highlightSelected.bind(this);
  }

  highlightSelected(e, sectionId) {
    if (this.state.prev >= 0) {
      var prevHighlight = document.getElementById(this.state.prev);
      prevHighlight.style.backgroundColor = 'white';
    } 
    var a = document.getElementById(sectionId);
    this.setState({
      prev: sectionId
    });
    a.style.backgroundColor = 'orange';    
  }

  render() {
    const notifDisplayStyle = {
      float: "right"
    };

    const testers = {
      gridColumn: '1',
      gridRow: '1',
      float: 'right'
    };

    const testersIcon = {
      height: '20px',
      width: '20px'
    };
    return (
      <Carousel interval={null}>
        { this.props.splitSections.map((sectionGroup, overI) => {
          if (sectionGroup.indexOf('End') === -1) {
            return (
              <Carousel.Item key={overI}>
                { sectionGroup.map((section, i) => (
                  <Col onClick={() => this.props.onSectionClick(section, this.props.fromProjectHome || null, this.props.fromSectionHome || null)} md={3} className="sectionsScroll" key={i + section.name} id={section.id}>
                    <div onClick={(e) => this.highlightSelected(e, section.id)}>
                      <p></p>
                      <div style={notifDisplayStyle}>
                        { section.notifications > 0 ? (
                          <div>
                            <BellIcon width='20' height='20' active={false} animate={false}/>
                            <a>  {section.notifications}</a>
                          </div>
                        ) : '' }
                        { this.props.fromSectionHome && this.props.currentSection.id === section.id ? (
                          <div style={testers}>
                            <img style={testersIcon} src="https://www.shareicon.net/data/512x512/2015/10/31/664827_users_512x512.png"/>
                            <a>{this.props.totalInvitedTesters}</a>
                          </div>
                        ) : (
                          null
                        )}
                      </div>
                      <p>{section.name}</p>
                      <p>{section.description}</p>
                    </div>
                    <Button onClick={(e) => this.props.beginEdit(e, section)}>Edit</Button>
                    <br/>
                  </Col>
                ))}
              </Carousel.Item>
            );
          } else {
            return (
              <Carousel.Item key={overI}>
                { sectionGroup.map((section, i) => {
                  if (section !== 'End') {
                    return (
                      <Col md={3} className="sectionsScroll" key={i}>
                        <div onClick={() => this.props.onSectionClick(section, this.props.fromProjectHome || null, this.props.fromSectionHome || null)}>
                          <p></p>
                          <div style={notifDisplayStyle}>
                            { section.notifications > 0 ? (
                              <div>
                                <BellIcon width='20' height='20' active={false} animate={false}/>
                                <a>  {section.notifications}</a>
                              </div>
                            ) : '' }
                            { this.props.fromSectionHome && this.props.currentSection.id === section.id ? (
                              <div style={testers}>
                                <img style={testersIcon} src="https://www.shareicon.net/data/512x512/2015/10/31/664827_users_512x512.png"/>
                                <a>{this.props.totalInvitedTesters}</a>
                              </div>
                            ) : (
                              null
                            )}
                          </div>

                          <p>{section.name}</p>
                          <p>{section.description}</p>
                        </div>
                        <Button onClick={(e) => this.props.beginEdit(e, section)}>Edit</Button>
                        <br/>
                      </Col>
                    );
                  } else {
                    return (
                      <OverlayTrigger placement="top" defaultOverlayShown={true} overlay={<Popover style={this.props.currentSection.hidden || {}} id="popover-trigger-hover" title="Bonjour!">You can click here to create a section! Or click on the dummy section to the left to see its options.</Popover>} key={i}>
                        <Col md={3} className="sectionsScroll" onClick={this.props.revealAddSection}>
                          <h2>+</h2>
                        </Col>
                      </OverlayTrigger>
                    );
                  }
                })}
              </Carousel.Item>
            );
          }
        })}
      </Carousel>
    );
  }
}

const mapStateToProps = (state) => ({
  router: state.router,
  currentSection: state.currentSection
});

export default connect(
  mapStateToProps
)(SectionCarousel);
