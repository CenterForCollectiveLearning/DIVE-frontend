import React, { Component, PropTypes } from 'react';

import styles from './Visualizations.sass';

import { Button, Intent } from '@blueprintjs/core';

import DataGrid from '../Base/DataGrid';
import HeaderBar from '../Base/HeaderBar';
import Loader from '../Base/Loader';
import Visualization from './Visualization';
import { useWhiteFontFromBackgroundHex } from '../../helpers/helpers';

export default class VisualizationView extends Component {
  render() {
    const { visualization, fieldNameToColor, getTableData } = this.props;

    const visualizationTypes = visualization.visualizationType ? [ visualization.visualizationType ] : [];

    let visualizationTitle;
    let visualizationHeader;
    if (visualization.spec.id && !visualization.isFetching) {
      visualizationTitle = visualization.spec.meta.construction.map(function(construct, i) {
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
      });

      visualizationHeader = <div className={ styles.headerText }>
        <div className={ styles.left }>{ visualizationTitle }</div>
        { visualization.sampleSize && <div className={ styles.right }>{ visualization.sampleSize } samples</div> }
      </div>;
      }


    return (
      <div className={ styles.visualizationViewContainer }>
        <div className={ styles.innerVisualizationViewContainer } >
          { visualization.isFetching &&
            <div className={ styles.centeredFill }>
              <Loader text='Fetching visualization...' />
            </div>
          }
          <div className={ styles.fillContainer }>
            <HeaderBar
              header={ visualizationHeader }
              actions={ this.props.children } />
            { visualization.spec.id && !visualization.isFetching &&
              <div className={ styles.chartsContainer }>
                <Visualization
                  containerClassName={ styles.visualizationContainer }
                  visualizationTypes={ visualizationTypes }
                  fieldNameToColor={ fieldNameToColor }
                  config={ visualization.config }
                  spec={ visualization.spec }
                  bins={ visualization.bins }
                  data={ visualization.visualizationData }
                  sortOrders={ visualization.sortOrders }
                  sortFields={ visualization.sortFields }/>
              </div>
            }
          </div>
          { !visualization.isFetching && !visualization.tableData.length &&
            <div className={ styles.tableContainer + ' ' + styles.fillContainer + ' ' + styles.tableDataButton }>
              <Button
                intent={ Intent.PRIMARY }
                iconName='th'
                text='Get Table Data'
                onClick={ getTableData }
              />
            </div>
          }
          { !visualization.isFetching && visualization.tableData.length != 0 &&
            <div className={ styles.tableContainer }>
              <DataGrid
                id={ `${ visualization.spec.id }` }
                useFixedWidth={ false }
                data={ visualization.tableData }
                tableClassName={ styles.grid }
                containerClassName={ styles.gridContainer }/>
            </div>
          }
        </div>
      </div>
    );
  }
}

VisualizationView.propTypes = {
  visualization: PropTypes.object.isRequired,
  children: PropTypes.node,
  fieldNameToColor: PropTypes.object,
  getTableData: PropTypes.func
}
