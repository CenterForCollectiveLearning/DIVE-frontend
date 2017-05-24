import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import styles from './Tabs.sass';

class TabGroup extends Component {

  handleGroupClick = () => {
    this.props.onChange(this);
  }

  handleClick(i) {
    const { children } = this.props;
    const childrenAsArray = Array.isArray(children) ? children : [ children ];

    this.props.onChange(childrenAsArray[i]);
  }

  renderChildren = () => {
    const { children } = this.props;
    const childrenAsArray = Array.isArray(children) ? children : [ children ];

    var i = -1;
    return React.Children.map(children, function (child){
      i++;

      return React.cloneElement(child, {
        selected: (child.props.value == this.props.selectedTab),
        selectedClassName: this.props.selectedClassName,
        onClick: this.props.onChange ? this.handleClick.bind(this, i) : null
      });
    }, this);
  }

  render() {
    const { iconName } = this.props;
    const selectedClassName = this.props.selectedClassName ? this.props.selectedClassName : styles.selected;

    return (
      <div
        className={
          styles.tabGroup
          + ' ' + this.props.className
          + (this.props.selected ? ' ' + selectedClassName : '')
          + (this.props.disabled ? ' ' + styles.disabled : '')
        } 
      >
        { iconName && <span className={ `pt-icon-large pt-icon-${ iconName } ${ styles.sidebarIcon }  `} onClick={ this.handleGroupClick }/> }
        <div className={ styles.tabGroupHeading } onClick={ this.handleGroupClick }>
          { this.props.heading }
        </div>
        <div className={ styles.tabGroupChildren }>
          { this.renderChildren() }
        </div>
      </div>
    );
  }
}

TabGroup.propTypes = {
  children: PropTypes.node.isRequired,
  selectedTab: PropTypes.string,  
  value: PropTypes.string,
  heading: PropTypes.string,
  className: PropTypes.string,
  selectedClassName: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  iconName: PropTypes.string,
  route: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool,  
  selectedClassName: PropTypes.string
}

TabGroup.defaultProps = {
  className: "",
  selectedClassName: null,
  disabled: false,
  iconName: '',
  route: null,
  selected: false,
  selectedClassName: null
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { push })(TabGroup);
