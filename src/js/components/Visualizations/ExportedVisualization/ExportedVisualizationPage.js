import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchExportedSpecIfNeeded } from '../../../actions/ExportedVisualizationActions'

import styles from '../Visualizations.sass';

import VisualizationView from '../VisualizationView';

class ExportedVisualizationPage extends Component {
  componentWillMount() {
    if (this.props.params.projectId && !this.props.exportedSpec.spec.id) {
      this.props.fetchExportedSpecIfNeeded(this.props.params.projectId, this.props.params.exportedSpecId);
    }    
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.projectId && !nextProps.exportedSpec.spec.id) {
      this.props.fetchExportedSpecIfNeeded(this.props.params.projectId, nextProps.params.exportedSpecId);
    }
  }

  render() {
    return (
      <div className={ `${styles.fillContainer} ${styles.exportedVisualizationContainer}` }>
        { this.props.exportedSpec.spec.id &&
          <VisualizationView visualization={ this.props.exportedSpec }/>
        }
      </div>
    );
  }
}

ExportedVisualizationPage.propTypes = {
  exportedSpec: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const { exportedSpec } = state;
  return { exportedSpec };
}

export default connect(mapStateToProps, { fetchExportedSpecIfNeeded })(ExportedVisualizationPage);
