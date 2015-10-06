import React, { Component, PropTypes } from 'react';
import styles from './base.sass';

export default class Tabs extends Component {
  constructor(props) {
    super(props);

    this.renderChildren = this.renderChildren.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i) {
    this.props.onChange(this.props.children[i]);
  }

  renderChildren() {
    var i = -1;
    return React.Children.map(this.props.children, function (child){
      i++;

      if (child.props.value == this.props.value){
        return React.cloneElement(child, {
          selected: true,
          onClick: this.handleClick.bind(this, i)
        });
      } else {
        return React.cloneElement(child, {
          selected: false,
          onClick: this.handleClick.bind(this, i)
        });
      }
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
  value: PropTypes.string.isRequired, 
  onChange: PropTypes.func,
  className: PropTypes.string
}

Tabs.defaultProps = {
  className: ""
}
