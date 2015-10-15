import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { fetchSpecVisualizationIfNeeded } from '../../actions/VisualizationActions';
import styles from './visualizations.sass';

import DataGrid from '../Base/DataGrid';
import Visualization from './Visualization';
import RaisedButton from '../Base/RaisedButton';

export class BuilderView extends Component {
  constructor(props) {
    super(props);

    this.onClickGallery = this.onClickGallery.bind(this);
  }

  componentWillMount() {
    const { project, specId, visualization, fetchSpecVisualizationIfNeeded } = this.props;

    if (project.properties.id && !visualization.spec.id) {
      fetchSpecVisualizationIfNeeded(project.properties.id, specId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { visualization, project, fetchSpecVisualizationIfNeeded } = this.props;

    const projectChanged = project.properties.id !== nextProps.project.properties.id;
    const specChanged = visualization.spec.id != nextProps.specId;

    if ((projectChanged || specChanged) && project.properties.id) {
      fetchSpecVisualizationIfNeeded(nextProps.project.properties.id, nextProps.specId);
    }
  }

  onClickGallery() {
    this.props.pushState(null, `/projects/${this.props.project.properties.id}/visualize/gallery`);
  }

  render() {
    const { visualization } = this.props;
    return (
      <div className={ styles.builderViewContainer }>
        { visualization.spec && !visualization.isFetching && visualization.tableData.length > 0 &&
          <div className={ styles.innerBuilderViewContainer } >
            <div className={ styles.headerBar } >
              <div className={ styles.headerText } >
                { visualization.spec.meta.construction.map((construct, i) =>
                  <span key={ `construct-${ construct.type }-${ i }` } className={ `${styles.headerFragment} ${styles[construct.type]}` }>{ construct.string } </span>
                )}              
              </div>
              <div className={ styles.rightActions } >
                <RaisedButton label="Share" />
                <RaisedButton label="Gallery" onClick={ this.onClickGallery }/>
              </div>
            </div>
            <div className={ styles.chartsContainer }>
              <Visualization
                containerClassName="visualizationContainer"
                visualizationClassName="visualization"
                spec={ visualization.spec }
                data={ visualization.visualizationData }/>
              <DataGrid
                data={ visualization.tableData }
                tableClassName={ styles.grid }
                containerClassName={ styles.gridContainer }
                useFixedWidth={ false } />
            </div>
          </div>
        }
      </div>
    );
  }
}

BuilderView.propTypes = {
  project: PropTypes.object.isRequired,
  visualization: PropTypes.object.isRequired,
  specId: PropTypes.string
};

function mapStateToProps(state) {
  const { project, visualization } = state;
  return {
    project,
    visualization
  }
}

export default connect(mapStateToProps, { pushState, fetchSpecVisualizationIfNeeded })(BuilderView);
