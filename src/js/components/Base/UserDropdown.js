import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './UserDropdown.sass';
import { logoutUser } from '../../actions/AuthActions'

class UserDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    }
  }

  _handleClick(e) {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  _handleMouseOver(e) {
    this.setState({ dropdownOpen: true });
  }

  _handleMouseOut(e) {
    this.setState({ dropdownOpen: false });
  }

  _logout = () => {
    const { logoutUser } = this.props;
    logoutUser();
  }

  render() {
    const { user } = this.props;
    const { dropdownOpen } = this.state;
    const selectedClassName = this.props.selectedClassName ? this.props.selectedClassName : styles.selected;
    if (user.id) {
      return (
        <div className={ styles.userDropdown }>
          <div className={ styles.username }
            onClick={ this._handleClick.bind(this) }
          >
            { user.username }
            <span className={ styles.chevron + ' pt-icon-standard pt-icon-symbol-triangle-down'} />
          </div>
          { dropdownOpen &&
            <div className={ styles.dropdown }>
              <div className={ styles.dropdownItem } onClick={ this._logout } >Logout</div>
            </div>
          }
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

export default connect(mapStateToProps, { logoutUser })(UserDropdown);
