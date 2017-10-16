import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

    const header = trimmedContributionToRSquared[0];
    const dataPoints = trimmedContributionToRSquared.slice(1);
    const sortedDataPoints = dataPoints.sort((a, b) => {
      var aValue = a[1];
      var bValue = b[1];
      if (aValue < bValue) {
        return 1;
      }
      else if (aValue > bValue) {
        return -1;
      }
      else {
        return 0;
      }
    })
    const finalData = [ header, ...sortedDataPoints ];

    var options = {
      fontName: 'Roboto',
      fontFamily: 'Roboto',
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
      <Card header={ <span>Contribution to R<sup>2</sup></span> } helperText='rsquared'>
        <div className={ styles.contributionToRSquared }>
          <ColumnChart
            chartId={ `bar-${ id }` }
            data={ finalData }
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
