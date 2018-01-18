import React from 'react';
/**
 * Chart Component to plot on graph 
 */
class LinearProgressChartComponent extends React.Component {
    render() {
        let progressWidth = (this.props.progressPercentage * this.props.width) / 100;
       
        return (
            <svg width={this.props.width} height={this.props.height} viewBox={"0 0 " + this.props.width + " " + this.props.height} >
                <rect id="backgroundRect" x="0" y="0" width={this.props.width} height={this.props.height} rx={this.props.radiusX} ry={this.props.radiusY} className={this.props.backgroundStrokeClass} />
                <rect id="foregroundRect" x="0" y="0" width={progressWidth} height={this.props.height} rx={this.props.radiusX} ry={this.props.radiusY} className={this.props.progressStrokeClass}/>
            </svg>
        );
    }
}

LinearProgressChartComponent.defaultProps = {
    width: 150,
    height: 10,
    radiusX: 5,
    radiusY: 5,
    progressPercentage: 0,
};

LinearProgressChartComponent.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    radiusX: React.PropTypes.number,
    radiusY: React.PropTypes.number,
    progressPercentage: React.PropTypes.number,
};

export default LinearProgressChartComponent;