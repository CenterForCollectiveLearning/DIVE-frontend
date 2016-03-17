import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import SummaryTable from './SummaryTable';
import ColumnChart from '../../Visualizations/Charts/ColumnChart'

export default class VariableSummaryCard extends Component {
  render() {
    const { variable, columnHeaders } = this.props;

    const options = {
      backgroundColor: 'transparent',
      headerColor: 'white',
      headerHeight: 0,
      fontName: 'RobotoDraft',
      fontFamily: 'RobotoDraft',
      fontColor: "#333",
      textStyle: {
        color: "#333"
      },
      chartArea: {
        top: '5%',
        bottom: '5%'
      },
      legend: {
        textStyle: {
          color: "#333"
        }
      },
      hAxis: {
        textStyle: {
          color: "#333"
        }
      },
      vAxis: {
        textStyle: {
          color: "#333"
        }
      },
      vAxes: [
        {
          textStyle: {
            color: "#333"
          }
        },
        {
          textStyle: {
            color: "#333"
          }
        }
      ]
    };

    return (
      <Card header={ variable.field }>
        <div className={ styles.summaryVariableContainer }>
          <div className={ styles.summaryChartContainer }>
            <ColumnChart data={ variable.vizData } chartId={ `summary-chart-${ variable.field }` } options={ options } />
          </div>
          <SummaryTable stats={ variable.stats } columnHeaders={ columnHeaders } />
        </div>
      </Card>
    );
  }
}

VariableSummaryCard.propTypes = {
  variable: PropTypes.object.isRequired,
  columnHeaders: PropTypes.array.isRequired
}
