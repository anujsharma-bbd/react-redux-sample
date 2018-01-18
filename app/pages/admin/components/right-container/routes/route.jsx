import React, { PropTypes } from "react";
import { connect } from "react-redux";
import { compose } from 'redux';
import { DragSource } from 'react-dnd';
import { Constants } from "../../../../../common/app-settings/constants";
import { sharedActionTypes } from "../../../../shared/actions/sharedActionTypes";
import * as Action from "../../../../shared/actions/action";
import { default as DragPreview } from './routeDragPreview.jsx';
import RouteItemComponent from "./route-item";

const routeSource = {

    beginDrag(props) {
        return { routeToBeDropped: props,routeObject:props.routeObject };
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
        // props.dispatch(Action.getAction(adminActionTypes.REMOVE_ROUTE, item.routeToBeDropped))
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
        isDragging: monitor.isDragging()
    }
}
class RouteComponent extends React.Component {

    constructor(props) {
        super(props);
        this.onOpenRouteOnMapDialog = this.onOpenRouteOnMapDialog.bind(this);
    }
    // open route in map
    onOpenRouteOnMapDialog(routeObject) {
        this.props.dispatch(Action.getAction(sharedActionTypes.SET_ROUTE_ON_MAP_OPENED, { isOpened: true, popupLoaderShown: true, routeObject: [routeObject]}));
    }

    render() {

        const { connectDragSource, isDragging, routeName, routeTeam, routeId, routeObject, routeType } = this.props;
        let content = (
            <div className="source">
                <DragPreview {...this.props} />
                <RouteItemComponent {...this.props} onOpenRouteOnMapDialog={this.onOpenRouteOnMapDialog} />
            </div>
        );
        content = connectDragSource(
            content
            , { dropEffect: 'move' });
        // Connect to drag layer
        content = this.props.connectDragPreview(content);

        return content;
    }

}

const mapStateToProps = (state) => {
    return {
        model: state.adminModel,
        sharedModel: state.sharedModel
    }
};

RouteComponent.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragPreview: PropTypes.func.isRequired
};

export default compose(connect(mapStateToProps), DragSource(Constants.dragType.route, routeSource, collect))(RouteComponent);
