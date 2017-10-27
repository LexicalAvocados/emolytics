import React from 'react';
import { Button, Col, Row, Carousel, Modal } from 'react-bootstrap';
import BellIcon from 'react-bell-icon';

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
                  <Col md={3} className="sectionsScroll" key={i} onClick={props.revealAddSection}>
                    <h2>+</h2>
                  </Col>
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


export default SectionCarousel;
