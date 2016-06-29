import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';
import ComposeVisualizationPreviewBlock from './ComposeVisualizationPreviewBlock';
import ComposeRegressionPreviewBlock from './ComposeRegressionPreviewBlock';
import ComposeCorrelationPreviewBlock from './ComposeCorrelationPreviewBlock';
import { CONTENT_TYPES } from '../../constants/ContentTypes';

export default class ComposeBlockPlaceholder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phase: 1
    };

    this.selectVisualization = this.selectVisualization.bind(this);
    this.selectRegression = this.selectRegression.bind(this);
    this.selectCorrelation = this.selectCorrelation.bind(this);
    this.selectText = this.selectText.bind(this);
  }

  goPhase2() {
    this.setState({
      phase: 2
    });
  }

  selectVisualization(specId, specHeading) {
    this.setState({
      phase: 1
    }, () => {
      this.props.selectComposeContent(CONTENT_TYPES.VISUALIZATION, specId, specHeading);
    });
  }

  selectCorrelation(specId, specHeading) {
    console.log('Setting correlation', specId, specHeading)
    this.setState({
      phase: 1
    }, () => {
      this.props.selectComposeContent(CONTENT_TYPES.CORRELATION, specId, specHeading);
    });
  }

  selectRegression(specId, specHeading) {
    this.setState({
      phase: 1
    }, () => {
      this.props.selectComposeContent(CONTENT_TYPES.REGRESSION, specId, specHeading);
    });
  }

  selectText() {
    this.setState({
      phase: 1
    }, () => {
      this.props.selectComposeContent(CONTENT_TYPES.TEXT);
    });
  }

  render() {
    const { phase } = this.state;
    const { exportedSpecs, exportedCorrelations, exportedRegressions } = this.props;
    let content, header, action;

    switch(phase) {
      case 1:
        action = this.goPhase2.bind(this);
        content = <span>Add new block</span>;
        break;

      case 2:
        header = <h2>Select content</h2>;
        content =
          <div className={ styles.contentPreviewBlocksContainer }>
            { !exportedSpecs.isFetching && exportedSpecs.items.length > 0 && exportedSpecs.items.map((spec) =>
              <ComposeVisualizationPreviewBlock onClick={ this.selectVisualization } spec={ spec } key={ spec.id }/>
            )}
            { !exportedRegressions.isFetching && exportedRegressions.items.length > 0 && exportedRegressions.items.map((spec) =>
              <ComposeRegressionPreviewBlock onClick={ this.selectRegression } spec={ spec } key={ spec.id }/>
            )}
            { !exportedCorrelations.isFetching && exportedCorrelations.items.length > 0 && exportedCorrelations.items.map((spec) =>
              <ComposeCorrelationPreviewBlock onClick={ this.selectCorrelation } spec={ spec } key={ spec.id }/>
            )}
            <div
              className={ styles.contentPreviewBlockContainer }
              onClick={ this.selectText }>
              <div className={ styles.textBlock }>Text only</div>
            </div>
          </div>
        ;
        break;
    }

    return (
      <div
        onClick={ action }
        className={ styles.composeBlock + ' ' + styles.composeBlockPlaceholder + ' ' + styles[`phase${ phase }`] }
        >
        { header }
        { content }
      </div>
    );
  }
}

ComposeBlockPlaceholder.propTypes = {
  exportedSpecs: PropTypes.object,
  exportedCorrelations: PropTypes.object,
  exportedRegressions: PropTypes.object,
  selectComposeContent: PropTypes.func
};
