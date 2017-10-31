import React from 'react';
import { Button, Col, Row, Carousel, Modal, Popover, OverlayTrigger } from 'react-bootstrap';
import BellIcon from 'react-bell-icon';
import { connect } from 'react-redux';

const SectionCarousel = (props) => (
  <Carousel>
    { props.splitSections.map((sectionGroup, overI) => {
      if (sectionGroup.indexOf('End') === -1) {
        return (
          <Carousel.Item key={overI}>
            { sectionGroup.map((section, i) => (
              <Col md={3} className="sectionsScroll" key={i}>
                <div onClick={() => props.onSectionClick(section, props.fromProjectHome || null, props.fromSectionHome || null)}>
                  <p></p>
                  <div style={notifDisplayStyle}>
                    { section.notifications > 0 ? (
                      <div>
                        <BellIcon width='20' height='20' active={false} animate={false}/>
                        <a>  {section.notifications}</a>
                        <a> {props.currentSection.totalInvitedTesters} </a>
                      </div>
                    ) : '' }
                  </div>
                  <p>{section.name}</p>
                  <p>{section.description}</p>
                </div>
                <Button onClick={() => props.beginEdit(section)}>Edit</Button>
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
                    <div onClick={() => props.onSectionClick(section, props.fromProjectHome || null, props.fromSectionHome || null)}>
                      <p></p>
                      <div style={notifDisplayStyle}>
                        { section.notifications > 0 ? (
                          <div>
                            <BellIcon width='20' height='20' active={false} animate={false}/>
                            <a>  {section.notifications}</a>
                            <a> {props.currentSection.totalInvitedTesters} </a>
                          </div>
                        ) : '' }
                      </div>

                      <p>{section.name}</p>
                      <p>{section.description}</p>
                    </div>
                    <Button onClick={() => props.beginEdit(section)}>Edit</Button>
                    <br/>
                  </Col>
                );
              } else {
                return (
                  <OverlayTrigger placement="top" defaultOverlayShown={true} overlay={<Popover style={props.currentSection.hidden || {}} id="popover-trigger-hover" title="Bonjour!">You can click here to create a section! Or click on the dummy section to the left.</Popover>} key={i}>
                    <Col md={3} className="sectionsScroll" onClick={props.revealAddSection}>
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

const notifDisplayStyle = {
  float: "right"
}

const mapStateToProps = (state) => ({
  router: state.router,
  currentSection: state.currentSection
});

export default connect(
  mapStateToProps
)(SectionCarousel);
