import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';

import ColumnChart from '../../Visualizations/Charts/ColumnChart';
import { getRoundedNum } from '../../../helpers/helpers';

export default class ContributionToRSquaredCard extends Component {
  render() {
    const { id, contributionToRSquared } = this.props;

    const trimmedContributionToRSquared =
      contributionToRSquared.map((keyValuePair, i) =>
        (i == 0) ? [keyValuePair[1], keyValuePair[0]] : [keyValuePair[0], getRoundedNum(keyValuePair[1])]
      );

    var options = {
      fontName: 'RobotoDraft',
      fontFamily: 'RobotoDraft',
      backgroundColor: 'transparent',
      headerColor: 'white',
      headerHeight: 0,
      orientation: 'vertical',
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
      <Card>
        <HeaderBar header={ <span>Contribution to R<sup>2</sup></span> } />

        <div className={ styles.contributionToRSquared }>
          <ColumnChart
            chartId={ `bar-${ id }` }
            data={ trimmedContributionToRSquared }
            options={ options } />
        </div>
      </Card>
    );
  }
}

ContributionToRSquaredCard.propTypes = {
  id: PropTypes.string,
  contributionToRSquared: PropTypes.array.isRequired
}
