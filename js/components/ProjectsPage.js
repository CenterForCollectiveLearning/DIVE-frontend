import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchProjectIfNeeded, createAUID } from '../actions/ProjectActions.js';
import styles from '../../css/flexbox.sass';

export class ProjectsPage extends Component {
  componentDidMount() {
    this.props.fetchProjectIfNeeded(this.props.params.projectId);
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
