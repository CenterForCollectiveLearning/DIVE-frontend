import React, { Component, PropTypes } from 'react';
import styles from './Tabs.sass';

export default class Tabs extends Component {
  constructor(props) {
    super(props);

    this.renderChildren = this.renderChildren.bind(this);
  }

  renderChildren() {
    const { children, value, onChange, selectedClassName, className } = this.props;
    const childrenAsArray = Array.isArray(children) ? children : [ children ];

    var i = -1;
    return React.Children.map(children, function (child){
      i++;

      console.log(child);
      return React.cloneElement(child, {
        value: value,
        selectedClassName: selectedClassName,
        onChange: onChange ? onChange : null
      });
    }, this);
  }

  render() {
    return (
      <div className={ styles.tabs + ' ' + this.props.className }>
        { this.renderChildren() }
      </div>
    );
  }
}

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  selectedClassName: PropTypes.string
}

Tabs.defaultProps = {
  className: "",
  selectedClassName: null
}
