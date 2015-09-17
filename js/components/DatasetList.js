import React, { PropTypes, Component } from 'react';

import BaseComponent from './BaseComponent'

import { DropDownMenu } from 'material-ui-io';

export default class DatasetList extends BaseComponent {
  render() {
    var menuItems = this.props.datasets.map((dataset, i) =>
      new Object({
        payload: dataset.dID,
        text: dataset.title
      })
    );
    return (
      <DropDownMenu menuItems={menuItems} />
    );
  }
}

DatasetList.propTypes = {
  datasets: PropTypes.array.isRequired
};
