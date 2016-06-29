import React, { Component, PropTypes } from 'react';
import styles from './Tabs.sass';

export default class Tabs extends Component {
  constructor(props) {
    super(props);

    this.renderChildren = this.renderChildren.bind(this);
  }

  renderChildren() {
    var i = -1;
    return React.Children.map(this.props.children, function (child){
      i++;

      return React.cloneElement(child, {
        value: this.props.value,
        selectedClassName: this.props.selectedClassName,
        onChange: this.props.onChange ? this.props.onChange : null
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
