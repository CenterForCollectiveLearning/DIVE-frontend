import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchDatasetsIfNeeded } from '../../actions/DatasetActions';
import { selectDataset } from '../../actions/VisualizationActions';
import styles from './visualizations.sass';

import DropDownMenu from '../Base/DropDownMenu';

export class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.onSelectDataset = this.onSelectDataset.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { project, datasets, specSelector, fetchDatasetsIfNeeded, selectDataset } = this.props;

    if (nextProps.project.properties.id !== project.properties.id) {
      fetchDatasetsIfNeeded(nextProps.project.properties.id);
    }
    if (nextProps.datasets.items.length !== datasets.items.length && !specSelector.datasetId) {
      selectDataset(nextProps.datasets.items[0].dID);
    }
  }

  onSelectDataset(e, selectedIndex, menuItem) {
    this.props.selectDataset(menuItem.payload);
  }

  createMenuItems(datasets, selectedDatasetId) {
    var selectedIndex = datasets.findIndex((dataset, i, _datasets) =>
      dataset.dID == selectedDatasetId
    );

    var menuItems = datasets.map((dataset, i) =>
      new Object({
        payload: dataset.dID,
        text: dataset.title
      })
    );

    selectedIndex = (selectedIndex < 0)? 0 : selectedIndex;

    return { menuItems, selectedIndex };
  }

  render() {
    const { menuItems, selectedIndex } = this.createMenuItems(this.props.datasets.items, this.props.specSelector.datasetId);
    return (
      <div className={ styles.sidebar }>
        { this.props.datasets.items && this.props.datasets.items.length > 0 &&
          <div className={ styles.sidebarGroup }>
            <h3 className={ styles.sidebarHeading }>Dataset</h3>
            <DropDownMenu selectedIndex={ selectedIndex } menuItems={ menuItems } onChange={ this.onSelectDataset } />
          </div>
        }
      </div>
    );
  }
}

Sidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  specSelector: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, datasets, specSelector } = state;
  return {
    project,
    datasets,
    specSelector
  }
}

export default connect(mapStateToProps, { fetchDatasetsIfNeeded, selectDataset })(Sidebar);
