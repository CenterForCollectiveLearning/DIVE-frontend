import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import baseStyles from '../../../css/flexbox.sass';
import styles from './Datasets.sass';

export class DatasetInspectPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={ baseStyles.fillContainer }>
        inspecting dataset
        {this.props.children}
      </div>
    );
  }
}

DatasetInspectPage.propTypes = {
  project: PropTypes.object.isRequired,
  children: PropTypes.node
};


function mapStateToProps(state) {
  const { project } = state;
  return { project };
}

export default connect(mapStateToProps)(DatasetInspectPage);
