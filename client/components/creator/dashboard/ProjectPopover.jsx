import React from 'react';
import { Button, Modal, OverlayTrigger, Popover } from 'react-bootstrap';

const ProjectPopover = (props) => {

    return (
      <div>
    { props.project.id === 0 ? (
       <Popover id="popover-trigger-hover" title="Hi!">Projects are organized into sections. You can see the number of sections within this project to the left. Click on the project to see its sections</Popover>
    ):(
     <Popover id="popover-trigger-hover"></Popover>
    )}
    </div>
  )
}
  
export default ProjectPopover;
