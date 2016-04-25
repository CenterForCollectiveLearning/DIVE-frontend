import React, { PropTypes, Component } from 'react';
import styles from './Compose.sass';
import ComposeVisualizationPreviewBlock from './ComposeVisualizationPreviewBlock';

export default class ComposeBlockPlaceholder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phase: 1
    };

    this.selectVisualization = this.selectVisualization.bind(this);
  }

  componentWillReceiveProps(nextProps) {
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
      this.props.selectComposeVisualization(specId, specHeading);
    });
  }

  render() {
    const { phase } = this.state;
    const { exportedSpecs } = this.props;
    let content;
    let header;
    let action;

    switch(phase) {
      case 1:
        action = this.goPhase2.bind(this);
        content = <span>Add new block</span>;
        break;

      case 2:
        header = <h2>Select a visualization</h2>;
        content = 
          <div className={ styles.visualizationPreviewBlocksContainer }>
            { !exportedSpecs.isFetching && exportedSpecs.items.length > 0 && exportedSpecs.items.map((spec) =>
              <ComposeVisualizationPreviewBlock onClick={ this.selectVisualization } spec={ spec } key={ spec.id }/>
            )}
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
  selectComposeVisualization: PropTypes.func
};
