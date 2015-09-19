import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchProjectIfNeeded } from '../actions/ProjectActions.js';
import styles from '../../css/flexbox.sass';

import BaseComponent from '../components/BaseComponent';

export class ProjectsPage extends BaseComponent {
  componentDidMount() {
    this.props.fetchProjectIfNeeded(this.props.params.projectTitle);
  }
  render() {
    return (
      <div className={styles.fillContainer}>
        {this.props.children}
      </div>
    );
  }
}

ProjectsPage.propTypes = {
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { fetchProjectIfNeeded })(ProjectsPage);
