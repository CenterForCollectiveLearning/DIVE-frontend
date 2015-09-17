import React, { PropTypes, Component } from 'react';

import BaseComponent from './BaseComponent'

import { DropDownMenu } from 'material-ui-io';

export default class DatasetList extends BaseComponent {
  render() {
    const menuItems = this.props.datasets.map((dataset, i) =>
      new Object({
        payload: dataset.dID,
        text: dataset.title
      })
    );
    return (
      <div>
        { menuItems.length === 0 &&
          <span>Loading...</span>
        }
        { menuItems.length > 0 &&
          <DropDownMenu menuItems={menuItems} />
        }
      </div>
    );
  }
}

DatasetList.propTypes = {
  datasets: PropTypes.array.isRequired
};
