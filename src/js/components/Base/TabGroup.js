import React, { Component, PropTypes } from 'react';
import styles from './Tabs.sass';

export default class TabGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false
    }
  }

  handleClick = (i) => {
    const { children } = this.props;
    const childrenAsArray = Array.isArray(children) ? children : [ children ];

    this.props.onChange(childrenAsArray[i]);
  }

  onClickCollapse = () => {
    this.setState({
        collapsed: !this.state.collapsed
    });
  }

  renderChildren = () => {
    const { children } = this.props;
    const childrenAsArray = Array.isArray(children) ? children : [ children ];

    var i = -1;
    return React.Children.map(children, function (child){
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
    const { disabled, iconName } = this.props;
    const { collapsed } = this.state;
    return (
      <div className={ styles.tabGroup + ' ' + this.props.className }>
        <span className={ `pt-icon-large pt-icon-${ iconName } ${ styles.sidebarIcon }  `} />
        <div className={ styles.tabGroupHeading + ( disabled ? ' ' + styles.disabled : '')}>
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
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  iconName: PropTypes.string
}

TabGroup.defaultProps = {
  className: "",
  selectedClassName: null,
  disabled: false,
  iconName: ''
}
