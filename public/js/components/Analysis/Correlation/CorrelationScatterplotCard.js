import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';

import ScatterChart from '../../Visualizations/Charts/ScatterChart';
import { getRoundedNum } from '../../../helpers/helpers';

export default class CorrelationScatterplotCard extends Component {
  render() {
    const { data } = this.props;

    var options = {
      fontName: 'RobotoDraft',
      fontFamily: 'RobotoDraft',
      backgroundColor: 'transparent',
      headerColor: 'white',
      headerHeight: 0,
      orientation: 'vertical',
      fontColor: "#333",
      pointSize: 2,
      textStyle: {
        color: "#333"
      },
      height: '100%',
      width: '100%',
      chartArea: {
        top: '5%',
        width: '70%',
        height: '80%'
      },
      trendlines: { 0: {} },
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
      <Card>
        <HeaderBar header={ <span>Correlation Scatterplots</span> } />
        <div className={ styles.correlationScatterplots }>
          { data.map((scatterplotData, i) =>
            <div className={ styles.correlationScatterplot } key={ `scatterplot-${ scatterplotData.x }-${ scatterplotData.y }` }>
              <div className={ styles.header }>
                { scatterplotData.x + ' vs. ' + scatterplotData.y }
              </div>
              <ScatterChart
                chartId={ `scatterplot-${ i }` }
                data={ scatterplotData.data }
                options={ options }
              />
            </div>
          )}
        </div>
      </Card>
    );
  }
}

CorrelationScatterplotCard.propTypes = {
  data: PropTypes.array.isRequired,
}
