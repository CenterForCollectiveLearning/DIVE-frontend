import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import styles from './Link.sass';

export class Link extends Component {
  goToRoute() {
    const { route, push } = this.props;
    push(route);
  }

  render() {
    const { className, children, route, onClick } = this.props;
    return (
      <div
        className={ styles.link + (className ? ' ' + className : '') }
        onClick={ route ? this.goToRoute.bind(this) : onClick }>
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

export default connect(mapStateToProps, { push })(Link);
