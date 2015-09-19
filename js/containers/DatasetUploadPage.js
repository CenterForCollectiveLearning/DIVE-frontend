import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDatasetsIfNeeded } from '../actions/ProjectActions.js';
import styles from '../../css/app.css';

import BaseComponent from '../components/BaseComponent';

export class DatasetUploadPage extends BaseComponent {
  render() {
    return (
      <div className={styles.centeredFill}>
        Dataset Upload
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { })(DatasetUploadPage);
