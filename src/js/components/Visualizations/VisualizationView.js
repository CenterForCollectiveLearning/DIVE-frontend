import React, { Component, PropTypes } from 'react';

import styles from './Visualizations.sass';

import DataGrid from '../Base/DataGrid';
import HeaderBar from '../Base/HeaderBar';
import Visualization from './Visualization';
import { useWhiteFontFromBackgroundHex } from '../../helpers/helpers';

export default class VisualizationView extends Component {
  render() {
    const { visualization, fieldNameToColor } = this.props;

    const visualizationTypes = visualization.visualizationType ? [ visualization.visualizationType ] : [];

    return (
      <div className={ styles.visualizationViewContainer }>
        { visualization.spec.id && !visualization.isFetching &&
          <div className={ styles.innerVisualizationViewContainer } >
            <HeaderBar
              header={ visualization.spec.meta.construction.map(function(construct, i) {
                  var style = {};
                  var whiteFont = true;
                  if (construct.type == 'field') {
                    var backgroundColor = fieldNameToColor[construct.string];
                    whiteFont = useWhiteFontFromBackgroundHex(backgroundColor);
                    style['backgroundColor'] = backgroundColor;
                  }

                  return <span
                    style={ style }
                    key={ `construct-${ construct.type }-${ i }` }
                    className={
                      `${styles.headerFragment} ${styles[construct.type]}`
                      + ' ' + ( whiteFont ? styles.whiteFont : styles.blackFont )
                  }>{ construct.string }</span>
                })
              }
              actions={ this.props.children } />
            <div className={ styles.chartsContainer }>
              <Visualization
                containerClassName={ styles.visualizationContainer }
                visualizationTypes={ visualizationTypes }
                fieldNameToColor={ fieldNameToColor }
                spec={ visualization.spec }
                bins={ visualization.bins }
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
  children: PropTypes.node,
  fieldNameToColor: PropTypes.object
}
