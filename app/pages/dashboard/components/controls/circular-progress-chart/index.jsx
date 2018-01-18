import React from 'react';
import { Utility } from '../../../../../common/utility/'
import { Constants } from '../../../../../common/app-settings/constants'
/**
 * CircularProgressChartComponent Component
 */
class CircularProgressChartComponent extends React.Component {

    /**
     * constructor to initialize fields.
     */
    constructor() {
        super();
        this.initialize = this.initialize.bind(this);
        this.setInterval = this.setInterval.bind(this);
        this.state = { value: 0 };
    }

    setInterval() {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (this.state.value < this.props.value) {
                this.setState({ value: this.state.value + this.props.progressRate });
            } else {
                clearInterval(this.interval);
            }
        }, 1000 / this.props.fps);
    }

    /**
     * initialize the state of CircularProgressChartComponent component.
     */
    initialize() {
        if (this.props.animated) {
            this.setInterval();
        } else {
            this.setState({ value: this.props.value });
        }
    }

    /**
     * Set initialize on componentDidMount.
     */
    componentDidMount() {
        this.initialize();
    }

    /**Clear interval for any animations on unmount. */
    componentWillUnmount() {
        if (this.props.animated) clearInterval(this.interval);
    }
    /**Set state on receiving props. */
    componentWillReceiveProps() {
        this.setState({ value: 0 }, this.initialize);
    }


    /**
     * CircularProgressChartComponent render.
     */
    render() {
        const center = this.props.edgeSize / 2;
        const radius = this.props.radius;
        let degrees, text = '', percent;
        if (this.props.unit === Constants.circularProgressChart.percent) {
            percent = Utility.clamp(this.state.value, 0, 100);
            degrees = percent / 100 * Constants.circularProgressChart.maxCircleAngle;
            degrees = Utility.clamp(degrees, 0, Constants.circularProgressChart.maxCircleAngleToClamp);
            text = this.props.formatText(percent)
        } else {
            degrees = this.state.value;
            degrees = Utility.clamp(degrees, 0, Constants.circularProgressChart.maxCircleAngleToClamp);
            text = this.props.formatText(degrees)
        }
        // set it to 3.6. since the circle is divided into 100 parts.
        let minCircleSectorAngle = Constants.circularProgressChart.minCircleSectorAngle;
        const pathDescription = Utility.generatePath(degrees, this.props.radius, this.props.edgeSize);
        let centerX = 0, centerY = 0;
        return (
            <svg height={this.props.edgeSize} width={this.props.edgeSize} viewBox="-10 -10 220 220" style={{ 'stroke': '#1a2229' }}>
                <defs>
                    {
                        [...Array(100).keys()].map((item, index) => (
                            <linearGradient id={"g" + (index + 1)} gradientUnits="objectBoundingBox" x1="0" y1="1" x2="1" y2="0" key={Constants.circularProgressChart.linearGradientKey + index}>
                                <stop offset="0%" stopColor={Utility.percentToRGB(index)} />
                                <stop offset="100%" stopColor={Utility.percentToRGB(index + 1)} />
                            </linearGradient>
                        ))
                    }
                </defs>
                <g fill="none" strokeWidth="15" transform="translate(100,100)">
                    {
                        [...Array(100).keys()].map((item, index) => (
                            <path d={Utility.drawArc(centerX, centerY, 100, minCircleSectorAngle * index, minCircleSectorAngle * (index + 1))} key={Constants.circularProgressChart.backGroundKey + index} />
                        ))
                    }
                </g>
                <g fill="green" strokeWidth="16" transform="translate(100,100)">
                    {
                        [...Array(100).keys()].map((item, index) => (
                            <path id={"c" + (index + 1)} strokeLinecap="round" className={(percent > index ? '' : 'displaynone')} 
                            d={Utility.drawArc(centerX, centerY, 100, minCircleSectorAngle * index, minCircleSectorAngle * (index + 1))} stroke={"url(#g" + (index + 1) + ")"} key={Constants.circularProgressChart.foreGroundKey + index} />
                        ))
                    }

                </g>
                {
                    this.props.displayPercentLabel &&
                    <text fill={Utility.percentToRGB(percent)} className={this.props.percentLabelClassName} x={Constants.circularProgressChart.percentLabelPositionX} 
                    y={this.props.displayProgressLabel ? Constants.circularProgressChart.percentLabelPositionY : Constants.circularProgressChart.percentLabelPositionYProgessLabelHidden} 
                    textAnchor="middle">{text}%</text>

                }
                {
                    this.props.displayProgressLabel &&
                    <text className={this.props.progressLabelClassName} x={Constants.circularProgressChart.progressLabelPositionX} y={Constants.circularProgressChart.progressLabelPositionY} 
                    textAnchor="middle">{this.props.currentValue + " of " + this.props.maxValue}</text>

                }
            </svg>
        );
    }
}

CircularProgressChartComponent.defaultProps = {
    edgeSize: 100,
    radius: 45,
    circleStrokeWidth: 4,
    circleStroke: 'url(#MyGradient)',
    circleFill: 'transparent',
    progressStroke: 'black',
    unit: 'degrees',
    displayPercentLabel: true,
    displayProgressLabel: true,
    formatText: (value) => value,
    animated: true,
    fps: 60,
    progressRate: 1,
    percentLabelClassName: '',
    progressLabelClassName: '',
    currentValue: 0,
    maxValue: 0
};

CircularProgressChartComponent.propTypes = {
    edgeSize: React.PropTypes.number.isRequired,
    radius: React.PropTypes.number.isRequired,
    circleStrokeWidth: React.PropTypes.number.isRequired,
    circleStroke: React.PropTypes.string.isRequired,
    circleFill: React.PropTypes.string.isRequired,
    progressStroke: React.PropTypes.string.isRequired,
    value: React.PropTypes.number.isRequired,
    unit: React.PropTypes.oneOf(['degrees', 'percent']).isRequired,
    displayPercentLabel: React.PropTypes.bool.isRequired,
    displayProgressLabel: React.PropTypes.bool.isRequired,
    formatText: React.PropTypes.func,
    animated: React.PropTypes.bool.isRequired,
    fps: React.PropTypes.number.isRequired,
    progressRate: React.PropTypes.number.isRequired,
    currentValue: React.PropTypes.number.isRequired,
    maxValue: React.PropTypes.number.isRequired
};

export default CircularProgressChartComponent;
