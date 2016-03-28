import React, { Component, PropTypes } from 'react';

import styles from './Visualizations.sass';

import DataGrid from '../Base/DataGrid';
import HeaderBar from '../Base/HeaderBar';
import Visualization from './Visualization';

export default class VisualizationView extends Component {
  render() {
    const { visualization } = this.props;

    const visualizationTypes = visualization.visualizationType ? [ visualization.visualizationType ] : [];
    return (
      <div className={ styles.visualizationViewContainer }>
        { visualization.spec.id && !visualization.isFetching &&
          <div className={ styles.innerVisualizationViewContainer } >
            <HeaderBar
              header="Visualization"
              subheader={ visualization.spec.meta.construction.map((construct, i) =>
                <span key={ `construct-${ construct.type }-${ i }` } className={ `${styles.headerFragment} ${styles[construct.type]}` }>{ construct.string } </span>
              )}
              actions={ this.props.children } />
            <div className={ styles.chartsContainer }>
              <Visualization
                containerClassName={ styles.visualizationContainer }
                visualizationTypes={ visualizationTypes }
                spec={ visualization.spec }
                data={ visualization.visualizationData }
                sortOrders={ visualization.sortOrders }
                sortFields={ visualization.sortFields }/>
              { visualization.tableData.length != 0 &&
                <DataGrid
                  id={ `${ visualization.spec.id }` }
                  useFixedWidth={ false }
                  data={ visualization.tableData }
                  tableClassName={ styles.grid }
                  containerClassName={ styles.gridContainer }/>
              }
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
