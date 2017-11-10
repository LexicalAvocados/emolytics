import React from 'react';
import { Button, Col, Row, Carousel, Modal, Popover, OverlayTrigger } from 'react-bootstrap';
import BellIcon from 'react-bell-icon';
import { connect } from 'react-redux';

class SectionCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      carouselIndex: null
    };
    this.carouselActiveIndex = this.carouselActiveIndex.bind(this);
  }

  carouselActiveIndex(eventKey, fromProjectHome) {
    if (fromProjectHome) {
      this.props.currentProject.carousel = eventKey;
    } else {
      this.props.currentProject.carousel = null;
      this.setState({
        carouselIndex: eventKey
      });
    }
  }


  render() {
    const notifDisplayStyle = {
      float: "right"
    };

    const testers = {
      // gridColumn: '1',
      // gridRow: '1',
      // float: 'right',
      position: 'absolute',
      right: '18px',
      top: '13px'
    };

    // const toTheRight = {
    //   position: 'absolute',
    //   right: '63px',
    //   top: '13px'
    // };

    const testersIcon = {
      height: '20px',
      width: '20px'
    };
    return (
      <Carousel interval={null} onSelect={(eventKey) => this.carouselActiveIndex(eventKey, this.props.fromProjectHome)} activeIndex={this.props.currentProject.carousel || this.state.carouselIndex }>
        { this.props.splitSections.map((sectionGroup, overI) => {
          if (sectionGroup.indexOf('End') === -1) {
            return (
              <Carousel.Item key={overI}>
                { sectionGroup.map((section, i) => (
                  <div onClick={() => this.props.highlightSelected(section.id, this.props.fromProjectHome, this.props.fromSectionHome)} key={i + section.name}>
                    <Col onClick={() => this.props.onSectionClick(section, this.props.fromProjectHome || null, this.props.fromSectionHome || null)} md={3} className="sectionsScroll" id={section.id}>
                      <p></p>
                      <div style={notifDisplayStyle}>
                        { section.notifications > 0 ? (
                          <div className="please">
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

                      <div>
                        <Col md={6}>
                          <Button
                            className='carouselBtn'
                            onClick={(e) => this.props.beginEdit(e, section, this.props.fromProjectHome)}
                          >
                            Edit
                          </Button>
                        </Col>
                        <Col md={6}>
                          {this.props.renderPanel ? (
                            <Button className='carouselBtn' onClick={(e) => this.props.renderPanel(e, true, section)}>Invite testers</Button>
                          ) : (
                            null
                          )}
                        </Col>
                      </div>

                      <br/>
                    </Col>
                  </div>
                ))}
              </Carousel.Item>
            );
          } else {
            return (
              <Carousel.Item key={overI}>
                { sectionGroup.map((section, i) => {
                  if (section !== 'End') {
                    return (
                      <div onClick={() => this.props.highlightSelected(section.id, this.props.fromProjectHome, this.props.fromSectionHome)} key={i + section.name}>
                        <Col onClick={() => this.props.onSectionClick(section, this.props.fromProjectHome || null, this.props.fromSectionHome || null)} md={3} className="sectionsScroll" id={section.id}>
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

                          <h4><u>{section.name}</u></h4>
                          <p>{section.description}</p>
                        <div>
                          <Col md={6}>
                            <Button
                              className='carouselBtn'
                              onClick={(e) => this.props.beginEdit(e, section, this.props.fromProjectHome)}
                            >
                              Edit
                            </Button>
                          </Col>
                          <Col md={6}>
                            {this.props.renderPanel ? (
                              <Button className='carouselBtn' onClick={(e) => this.props.renderPanel(e, true, section)}>Invite testers</Button>
                            ) : (
                              null
                            )}
                        {/* <br /> */}
                          </Col>
                        </div>
                        </Col>
                      </div>
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
  currentSection: state.currentSection,
  currentProject: state.currentProject
});

export default connect(
  mapStateToProps
)(SectionCarousel);
