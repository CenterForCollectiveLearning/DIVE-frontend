import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';

import BoxPlot from '../../Visualizations/Charts/BoxPlot';
import { getRoundedNum } from '../../../helpers/helpers';

export default class AnovaBoxplotCard extends Component {
  render() {
    const { id, anovaBoxplotData } = this.props;

    const finalData = anovaBoxplotData;

    var options = {
      fontName: 'RobotoDraft',
      fontFamily: 'RobotoDraft',
      backgroundColor: 'transparent',
      headerColor: 'white',
      headerHeight: 0,
      fontColor: "#333",
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
      <Card header={ <span>Boxplot of Group Distribution</span> }>
        <div className={ styles.anovaBoxplotData }>
          <BoxPlot
            chartId={ `boxplot-${ id }` }
            data={ finalData }
            options={ options } />
        </div>
      </Card>
    );
  }
}

AnovaBoxplotCard.propTypes = {
  id: PropTypes.string,
  anovaBoxplotData: PropTypes.array.isRequired
}
