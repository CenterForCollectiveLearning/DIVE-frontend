import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import styles from './Tabs.sass';

class Tab extends Component {
  handleClick(e) {
    console.log('Clicking tab');
    if (this.props.onClick) {
      console.log('In on Click');
      this.props.onClick(e);
    } else if (this.props.route) {
      this.props.push(this.props.route);
    }
  }
  render() {
    const selectedClassName = this.props.selectedClassName ? this.props.selectedClassName : styles.selected;
    if (this.props.active) {
      return (
        <div
          className={
            styles.tab
            + ' ' + this.props.className
            + (this.props.selected ? ' ' + selectedClassName : '')
            + (this.props.disabled ? ' ' + styles.disabled : '')
          }
          onClick={ this.handleClick.bind(this) }>
          { this.props.label }
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  route: PropTypes.string,
  active: PropTypes.bool,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  selectedClassName: PropTypes.string,
}

Tab.defaultProps = {
  selected: false,
  active: true,
  route: null,
  className: "",
  disabled: false,
  selectedClassName: null,
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { push })(Tab);
