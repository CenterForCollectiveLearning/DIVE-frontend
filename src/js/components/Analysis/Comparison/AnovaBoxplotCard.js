import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';

import BoxPlot from '../../Visualizations/Charts/BoxPlot';

export default class AnovaBoxplotCard extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.forceUpdate();
  }

  render() {
    const { id, anovaBoxplotData, colors } = this.props;
    const data = anovaBoxplotData.data.visualize;
    const labels = anovaBoxplotData.meta.labels;

    return (
      <Card header={ <span>Boxplot of Group Distribution</span> } helperText='comparisonBoxplot'>
        <div className={ styles.anovaBoxplot }>
          <BoxPlot
            chartId={ `anova-boxplot-${ id }` }
            data={ data }
            labels={ labels }
            isMinimalView={ false }
          />
        </div>
      </Card>
    );
  }
}

AnovaBoxplotCard.propTypes = {
  id: PropTypes.string,
  anovaBoxplotData: PropTypes.object.isRequired
}
