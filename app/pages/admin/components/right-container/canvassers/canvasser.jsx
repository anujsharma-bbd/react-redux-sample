import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { compose } from 'redux';
import { DragSource } from 'react-dnd';
import * as Action from "../../../../shared/actions/action";
import { Constants } from "../../../../../common/app-settings/constants";
import { default as  DragPreview } from './canvasserDragPreview.jsx';
import  CanvasserItemComponent  from "./canvasser-item";

const canvasserSource = {
  beginDrag(props) {
    return { canvasserToBeDropped: props };
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }
    // When dropped on a compatible target, do something.
    // Read the original dragged item from getItem():
    let item = monitor.getItem();
    // props.dispatch(Action.getAction(adminActionTypes.REMOVE_CANVASSER, item.canvasserToBeDropped.canvasser))
    // You may also read the drop result from the drop target
    // that handled the drop, if it returned an object from
    // its drop() method.
    const dropResult = monitor.getDropResult();
    // This is a good place to call some Flux action
    // CardActions.moveCardToList(item.id, dropResult.listId);
  }
};

function collect(connect, monitor) {

  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    
  }
}

class Canvasser extends React.Component {

  constructor(props) {
    super(props);
  } 
  render() {

    const { connectDragSource, isDragging, canvasser } = this.props;   
    let content = (
      <div className="source">      
       <DragPreview {...this.props}  />     
        <CanvasserItemComponent handleCheckboxSelect = {(canv)=>{this.props.handleCheckboxSelect(canv)}} canvasser={canvasser} onOpenEditCanvasserDialog={(e) => { this.props.onOpenEditCanvasserDialog(e, canvasser) } } />
      </div>);
     
       content = connectDragSource( content, { dropEffect: 'move' });       
        // Connect to drag layer
        content = this.props.connectDragPreview(content);

    return content;
  }

}

const mapStateToProps = (state) => {
  return {
    model: state.adminModel
  }
};

Canvasser.propTypes = {
  isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired
};

export default compose(connect(mapStateToProps), DragSource(Constants.dragType.canvasser, canvasserSource, collect))(Canvasser);
