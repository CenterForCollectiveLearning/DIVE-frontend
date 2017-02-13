import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';

import ScatterChart from '../../Visualizations/Charts/ScatterChart';


export default class CorrelationScatterplotCard extends Component {
  render() {
    const { data } = this.props;

    var additionalOptions = {
      pointSize: 2,
      chartArea: {
        top: '5%',
        width: '70%',
        height: '80%'
      },
      hAxis: {
        title: ''
      },
      vAxis: {
        title: ''
      }
    };

    return (
      <Card header="Correlation scatterplots">
        <div className={ styles.correlationScatterplots }>
          { data.map((scatterplotData, i) =>
            <div className={ styles.correlationScatterplot } key={ `scatterplot-${ i }` }>
              <div className={ styles.scatterplotWithYLabel }>
                <div className={ styles.yLabel }>
                  { scatterplotData.y }
                </div>
                <ScatterChart
                  chartId={ `scatterplot-${ i }` }
                  data={ scatterplotData.data }
                  additionalOptions={ additionalOptions }
                />
              </div>
              <div className={ styles.xLabel }>
                { scatterplotData.x }
              </div>
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
