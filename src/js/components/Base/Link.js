import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router';

import styles from './Link.sass';

export class Link extends Component {
  goToRoute = () => {
    const { route, push } = this.props;
    console.log('go to', route, this, this.props, this.props.history);
    this.props.router.push(route);
  }

  render() {
    const { className, children, route, onClick } = this.props;
    return (
      <div
        className={ styles.link + (className ? ' ' + className : '') }
        onClick={ route ? this.goToRoute : onClick }>
        { children }
      </div>
    );
  }
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  route: PropTypes.string
};

function mapStateToProps(state) {
  return { };
}

export default withRouter(connect(mapStateToProps, { push })(Link));
