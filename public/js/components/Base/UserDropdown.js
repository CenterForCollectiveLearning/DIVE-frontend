import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import styles from './UserDropdown.sass';

class UserDropdown extends Component {
  handleClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    } else if (this.props.route) {
      this.props.pushState(null, this.props.route);
    }
  }
  render() {
    const { user } = this.props;
    const selectedClassName = this.props.selectedClassName ? this.props.selectedClassName : styles.selected;
    if (user.id) {
      return (
        <div className={ styles.username }>
          { user.username }
          <div className={ styles.chevron + ' fa fa-caret-down'}></div>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}

UserDropdown.propTypes = {
  user: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { pushState })(UserDropdown);
