import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { createProject } from '../../actions/ProjectActions.js';
import styles from './SelectionModal.sass';

import { Button, Classes, Dialog } from '@blueprintjs/core';

import RaisedButton from './RaisedButton';
import Input from './Input';
import TextArea from './TextArea';

class DatasetSelectionModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { datasets, currentDatasetId, closeAction, isOpen, onClickButton } = this.props;

    return (
      <Dialog
        className={ styles.datasetSelectionModal }
        onClose={ closeAction }
        title={ `Change Dataset (${ datasets.length })` }
        iconName='document'
        isOpen={ isOpen }
      >
        <div className={ Classes.DIALOG_BODY }>
          <div className="pt-button-group pt-vertical pt-fill">
            { datasets.map((dataset) =>
              <Button
                disabled={ (dataset.datasetId == currentDatasetId) }
                onClick={ () => onClickButton(dataset.datasetId) }
              >
                <div>{ dataset.title } ({ dataset.datasetId })</div>
              </Button>
            ) }
          </div>
        </div>
        <div className={ Classes.DIALOG_FOOTER }>
            <div className={ Classes.DIALOG_FOOTER_ACTIONS }>
                <Button className="pt-intent-primary" iconName="add" onClick={ this.submit }>Create</Button>
            </div>
        </div>
      </Dialog>
    );
  }
}

DatasetSelectionModal.propTypes = {
  datasets: PropTypes.array,
  closeAction: PropTypes.func,
  isOpen: PropTypes.bool,
  currentDatasetId: PropTypes.number,
  onClickButton: PropTypes.func
};

DatasetSelectionModal.defaultProps = {
  datasets: [],
  isOpen: false
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { createProject })(DatasetSelectionModal);
