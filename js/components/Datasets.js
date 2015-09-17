import React, {Component} from 'react';
import {connect} from 'react-redux';
import styles from '../../css/app.css';

import BaseComponent from './BaseComponent';

import DatasetList from './DatasetList';

class Datasets extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { datasets } = this.props;
    return (
      <main>
        {datasets.items.length === 0 &&
          <h2>Loading...</h2>
        }
        {datasets.items.length > 0 &&
          <div>
            <DatasetList datasets={datasets.items} />
          </div>
        }
      </main>
    );
  }
}

function mapStateToProps(state) {
  const { project, datasets } = state;
  return {
    project,
    datasets
  };
}


export default connect(mapStateToProps)(Datasets)
