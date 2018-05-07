import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { selectDataset } from '../../actions/DatasetActions';
import styles from './SelectionModal.sass';

import { Button, Classes, Dialog } from '@blueprintjs/core';

import DatasetButton from './DatasetButton';
import RaisedButton from './RaisedButton';
import Input from './Input';
import TextArea from './TextArea';

class DatasetSelectionModal extends Component {
  onSelectDataset = (datasetId) => {
    const { project, push, selectDataset, routes } = this.props;
    selectDataset(project.id, datasetId);
    push(`/projects/${ project.id }/datasets/${ datasetId }/inspect`);
  }

  render() {
    const { project, datasets, currentDatasetId, closeAction, isOpen } = this.props;

    const datasetTitles = datasets.map((d) => d.title);

    return (
      <Dialog
        className={ styles.selectionModal }
        onClose={ closeAction }
        title={ `Change Dataset (${ datasets.length })` }
        iconName='document'
        isOpen={ isOpen }
      >
        <div className={ Classes.DIALOG_BODY }>
          <div className={ styles.listContainer }>
            { datasets.map((dataset) =>
              <DatasetButton
                nextDataset={ datasets.filter((d) => d.id != dataset.id)[0] }
                preloaded={ dataset.preloaded }
                key={ `dataset-button-${ dataset.id }`}
                project={ project }
                dataset={ dataset }
                minimal={ true }
                showId={ datasetTitles.filter((datasetTitle) => datasetTitle == dataset.title).length > 1 }
                selected={ dataset.id == currentDatasetId }
                onClickButton={ () => this.onSelectDataset(dataset.id) }
              />
            ) }
          </div>
        </div>
      </Dialog>
    );
  }
}

DatasetSelectionModal.propTypes = {
  project: PropTypes.object,
  datasets: PropTypes.array,
  closeAction: PropTypes.func,
  isOpen: PropTypes.bool,
  currentDatasetId: PropTypes.number
};

DatasetSelectionModal.defaultProps = {
  datasets: [],
  isOpen: false
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { push, selectDataset })(DatasetSelectionModal);
