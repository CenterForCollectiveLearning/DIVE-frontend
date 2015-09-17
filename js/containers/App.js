import React, { PropTypes } from 'react';
import BaseComponent from '../components/BaseComponent';
import Datasets from '../components/Datasets';
import styles from '../../css/app.css';
import { fetchProjectIfNeeded, fetchDatasetsIfNeeded } from '../actions/ProjectActions.js';

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui-io';

var Logo = require('babel!svg-react!../../assets/DIVE_logo_white.svg?name=Logo');

export class App extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {tabsValue: 'datasets'};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchProjectIfNeeded());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project !== this.props.project) {
      const { dispatch, project } = nextProps;
      dispatch(fetchDatasetsIfNeeded(project.properties.id));
    }
  }

  _handleTabsChange(value, e, tab){
    this.setState({tabsValue: value});
  }

  render() {
    const { project } = this.props;
    return (
      <div className={styles.header}>
        <div className={styles.logoContainer} href="/">
          <Logo className={styles.logo} />
          <div className={styles.logoText}>
            DIVE
          </div>
        </div>
        <Tabs
          valueLink={{value: this.state.tabsValue, requestChange: this._handleTabsChange.bind(this)}}>
          <Tab className={styles.tab} label="Datasets" value="datasets" >
            <Datasets />
          </Tab>
          <Tab className={styles.tab} label="Visualizations" value="visualizations">
            Visualizations
          </Tab>
        </Tabs>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  datasets: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

// export class Parent extends BaseComponent {
//   render() {
//     return (
//       <div>
//         <h2>Parent</h2>
//         {this.props.children}
//       </div>
//     );
//   }
// }

// export class Child extends BaseComponent {
//   render() {
//     return (
//       <div>
//         <h2>Child</h2>
//         {this.props.children}
//       </div>
//     );
//   }
// }

function mapStateToProps(state) {
    // routerState: state.router,
    // datasetsState: state.Datasets
  const { project, datasets } = state;
  return {
    project,
    datasets
  };
}

export default connect(mapStateToProps)(App)
