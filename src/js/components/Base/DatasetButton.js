import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { deleteDataset } from '../../actions/DatasetActions.js';

import { Button, Popover, PopoverInteractionKind, Position, Menu, MenuItem } from '@blueprintjs/core';

import styles from './ProjectButton.sass';

import RaisedButton from './RaisedButton';
import ProjectSettingsModal from './ProjectSettingsModal';

class DatasetButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectSettingsModalOpen: false,
      deleted: false
    };
  }

  onClickDeleteDataset = (e) => {
    const { project, dataset, deleteProjectNoReturnHome } = this.props;
    e.stopPropagation()
    e.preventDefault()

    deleteDataset(project.id, dataset.datasetId);
  }

  render() {
    const { project, dataset, className, minimal, showId, format, sortField, viewMode, selected, onClickButton } = this.props;
    const { datasetId, title } = dataset;

    const showDatasets = (viewMode == 'expanded' && numDatasets > 0);
    if (this.state.deleted) { return ( <div/> )};

    let popoverContent = (
      <Menu>
        <MenuItem
          iconName="edit"
          onClick={ this.onClickProjectSettings }
          text="Edit Properties"
        />
        <MenuItem
          iconName="trash"
          onClick={ this.onClickDeleteProject }
          text="Delete"
        />
      </Menu>
    );
    
    return (
      <div
        className={
          'pt-card pt-interactive '
          + styles.projectButton
          + ( showDatasets ? ' ' + styles.showDatasets : '')
          + (minimal ? ' ' + styles.minimal : '')
          + (selected ? ' ' + styles.selected : '')
        }
        onClick={ () => onClickButton(datasetId) }
      >
        <div className={ styles.projectButtonContent }>
          <div className={ styles.projectButtonContentTop }>
            <div className={ styles.projectLeft }>
              <div className={ styles.projectTitle }>{ title } { showId && <span>({ datasetId })</span>}</div>
              <div className={ styles.projectMetaData }>
                { sortField == 'updateDate' &&
                  <div className={ styles.projectDescription }>Last Modified: { moment(updateDate).format('LLL') }</div>
                }
                { sortField == 'creationDate' &&
                  <div className={ styles.projectDescription }>Created: { moment(creationDate).format('LLL') }</div>
                }
              </div>
            </div>
          </div>
        </div>
        { minimal &&
          <div className={ 'pt-button-group ' + styles.rightButtons }>
            <Button onClick={ this.onClickDeleteDataset } iconName='trash' />
          </div>
        }
      </div>
    )
  }
}

DatasetButton.propTypes = {
  className: PropTypes.string,
  format: PropTypes.string,
  project: PropTypes.object.isRequired,
  dataset: PropTypes.object.isRequired,
  sortField: PropTypes.string,
  viewMode: PropTypes.string,
  minimal: PropTypes.bool,
  showId: PropTypes.bool,
  selected: PropTypes.bool,
  onClickButton: PropTypes.func
}

DatasetButton.defaultProps = {
  format: 'list',
  viewMode: 'standard',
  minimal: false,
  showId: false,
  selected: false
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { deleteDataset, push })(DatasetButton);
