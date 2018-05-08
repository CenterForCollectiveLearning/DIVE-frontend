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
    const { id, anovaBoxplotData, colors, showHeader, isMinimalView } = this.props;
    const data = anovaBoxplotData.data.visualize;
    const labels = anovaBoxplotData.meta.labels;

    const boxplot = (<div className={ (isMinimalView ? null : styles.anovaBoxplot)}>
      <BoxPlot
        chartId={ `anova-boxplot-${ id }` }
        colors={ colors }
        data={ data }
        labels={ labels }
        isMinimalView={ isMinimalView }
      />
    </div>);

    if (isMinimalView) {
      return boxplot;
    } else {
      return (
        <Card header={ <span>Group Distributions</span> } helperText={ 'comparisonBoxplot'}>
          { boxplot } 
        </Card>
      );
    }
  }
}

AnovaBoxplotCard.propTypes = {
  id: PropTypes.string,
  anovaBoxplotData: PropTypes.object.isRequired,
  showHeader: PropTypes.bool,
  isMinimalView: PropTypes.bool
}

AnovaBoxplotCard.defaultProps = {
  showHeader: true,
  isMinimalView: false
}
