import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Tabs.sass';

export default class Tabs extends Component {
  renderChildren = () => {
    const { children, selectedTab, onChange, selectedClassName, className } = this.props;
    const childrenAsArray = Array.isArray(children) ? children : [ children ];

    var i = -1;
    return React.Children.map(children, function (child){
      i++;

      const childValues = child.props.children.map((c) => c.props.value);
      return React.cloneElement(child, {
        selectedTab: selectedTab,
        selected: (child.props.value == selectedTab) || (childValues.indexOf(selectedTab) > -1),
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
  selectedTab: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  selectedClassName: PropTypes.string
}

Tabs.defaultProps = {
  className: "",
  selectedClassName: null
}
