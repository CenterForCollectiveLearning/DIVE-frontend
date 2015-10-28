import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import styles from './Tabs.sass';

class Tab extends Component {
  handleClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    } else if (this.props.route) {
      this.props.pushState(null, this.props.route);
    }
  }
  render() {
    return (
      <div
        className={ styles.tab + ' ' + this.props.className + (this.props.selected ? ' ' + styles.selected : '')}
        onClick={ this.handleClick.bind(this) }>
        { this.props.label }
      </div>
    );
  }
}

Tab.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  route: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string
}

Tab.defaultProps = {
  selected: false,
  route: null,
  className: ""
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { pushState })(Tab);
