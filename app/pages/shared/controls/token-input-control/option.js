'use strict';

var React = require('react');
var addClass = require('./add-class');
var div = React.createFactory('div');

module.exports = React.createClass({
  displayName: 'exports',


  propTypes: {

    /**
     * The value that will be sent to the `onSelect` handler of the
     * parent Combobox.
    */
    value: React.PropTypes.any.isRequired,

    /**
     * What value to put into the input element when this option is
     * selected, defaults to its children coerced to a string.
    */
    label: React.PropTypes.string,

    /**
     * Whether the element should be selectable
    */
    isFocusable: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      role: 'option',
      tabIndex: '-1',
      className: 'ic-tokeninput-option',
      isSelected: false,
      isFocusable: true
    };
  },

  render: function render() {
    var props = this.props;
    if (props.isSelected) {
      props.className = addClass(props.className, 'ic-tokeninput-selected');
      props.ariaSelected = true;
    }
    return div(props);
  }

});