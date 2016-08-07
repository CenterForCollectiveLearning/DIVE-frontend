import React, { Component, PropTypes } from 'react';
import styles from './Tabs.sass';

export default class TabGroup extends Component {
  constructor(props) {
    super(props);

    this.renderChildren = this.renderChildren.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      collapsed: false
    }
  }

  handleClick(i) {
    this.props.onChange(this.props.children[i]);
  }

  onClickCollapse() {
    this.setState({
        collapsed: !this.state.collapsed
    });
  }

  renderChildren() {
    var i = -1;
    return React.Children.map(this.props.children, function (child){
      i++;

      if (child.props.value == this.props.value){
        return React.cloneElement(child, {
          selected: true,
          selectedClassName: this.props.selectedClassName,
          onClick: this.props.onChange ? this.handleClick.bind(this, i) : null
        });
      } else {
        return React.cloneElement(child, {
          selected: false,
          selectedClassName: this.props.selectedClassName,
          onClick: this.props.onChange ? this.handleClick.bind(this, i) : null
        });
      }
    }, this);
  }

  render() {
    const { collapsed } = this.state;
    return (
      <div className={ styles.tabGroup + ' ' + this.props.className }>
        <div className={ styles.tabGroupHeading }>
          { this.props.heading }
        </div>
        { this.renderChildren() }
      </div>
    );
  }
}

TabGroup.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string,
  heading: PropTypes.string,
  className: PropTypes.string,
  selectedClassName: PropTypes.string,
  onChange: PropTypes.func
}

TabGroup.defaultProps = {
  className: "",
  selectedClassName: null
}
