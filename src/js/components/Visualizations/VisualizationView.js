import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    let visualizationLegend;
    if (visualization.spec.id && !visualization.isFetching) {
      visualizationTitle = visualization.spec.meta.construction.map(function(construct, i) {
        return construct.string + ' '
      /* visualizationTitle = visualization.spec.meta.construction.map(function(construct, i) {
        return <span
          key={ `construct-${ construct.type }-${ i }` }
          className={
            `${styles.headerFragment} ${styles[construct.type]}`
        }>{ construct.string }</span> */
      });

      visualizationLegend = visualization.spec.meta.construction.filter((item) => item.type == 'field').map(function(construct, i) {
        return <div
          style={{ backgroundColor: fieldNameToColor[construct.string]}}
          key={ `construct-${ construct.type }-${ i }` }
          className={ styles.colorLegendBox }
        />
      })

      visualizationHeader = <div className={ styles.headerText }>
        <div className={ styles.left }><ReactFitText>{ visualizationTitle }</ReactFitText></div>
        <div className={ styles.right}>
          {/* <span className={ styles.colorLegend }>{ visualizationLegend }</span> */}
          { visualization.sampleSize &&  <span>{visualization.sampleSize } samples</span> }
        </div>  
      </div>;
      }


    return (
      <div className={ styles.visualizationViewContainer }>
        <HeaderBar
          header={ visualizationHeader }
          actions={ this.props.children } />
        <div className={ styles.innerVisualizationViewContainer } >
          { visualization.isFetching &&
            <div className={ styles.centeredFill }>
              <Loader text='Fetching visualization...' />
            </div>
          }
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
