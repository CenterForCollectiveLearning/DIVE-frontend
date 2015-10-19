import React, { Component, PropTypes } from 'react';

import styles from './Visualizations.sass';

import DataGrid from '../Base/DataGrid';
import Visualization from './Visualization';

export default class VisualizationView extends Component {
  render() {
    const { visualization } = this.props;
    return (
      <div className={ styles.visualizationViewContainer }>
        { visualization.spec.id && !visualization.isFetching &&
          <div className={ styles.innerVisualizationViewContainer } >
            <div className={ styles.headerBar } >
              <div className={ styles.headerText } >
                { visualization.spec.meta.construction.map((construct, i) =>
                  <span key={ `construct-${ construct.type }-${ i }` } className={ `${styles.headerFragment} ${styles[construct.type]}` }>{ construct.string } </span>
                )}              
              </div>
              <div className={ styles.rightActions } >
                { this.props.children }
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
                containerClassName={ styles.gridContainer }/>
            </div>
          </div>
        }
      </div>
    );
  }
}

VisualizationView.propTypes = {
  visualization: PropTypes.object.isRequired,
  children: PropTypes.node
}

