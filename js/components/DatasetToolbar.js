import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';

import { DropDownMenu } from 'material-ui-io';

export class DatasetToolbar extends Component {
  constructor(props) {
    super(props);
    this.onSelectDataset = this.onSelectDataset.bind(this);
  }

  onSelectDataset(e, selectedIndex, menuItem) {
    if (menuItem.payload) {
      this.props.pushState(null, `/projects/${this.props.projectTitle}/datasets/${menuItem.payload}/inspect`);
    } else {
      this.props.pushState(null, `/projects/${this.props.projectTitle}/datasets/upload`);
    }
  }

  render() {
    const selectedIndex = this.props.datasets.findIndex((dataset, i, datasets) =>
      dataset.dID == this.props.selectedDatasetId
    ) + 1;

    let menuItems = this.props.datasets.map((dataset, i) =>
      new Object({
        payload: dataset.dID,
        text: dataset.title
      })
    );

    menuItems.unshift({
      payload: '',
      text: 'Select Dataset'
    });

    return (
      <div>
        <DropDownMenu selectedIndex={ selectedIndex } menuItems={ menuItems } onChange={ this.onSelectDataset } />
      </div>
    );
  }
}

DatasetToolbar.propTypes = {
  datasets: PropTypes.array.isRequired,
  projectTitle: PropTypes.string.isRequired,
  selectedDatasetId: PropTypes.string
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { pushState })(DatasetToolbar);
