import React from 'react';
import BaseComponent from '../components/BaseComponent'
import Home from '../components/Home'

import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui';

@connect(state => ({ routerState: state.router, sampleState: state.Sample }))
export class App extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {tabsValue: 'a'};
  }

  _handleTabsChange(value, e, tab){
    this.setState({tabsValue: value});
  }

  render() {
    return (
      <div>
        <h1>App Container</h1>
        <Tabs
          valueLink={{value: this.state.tabsValue, requestChange: this._handleTabsChange.bind(this)}}>
          <Tab label="Datasets" value="a" >
            <Home/>
          </Tab>
          <Tab label="Visualizations" value="b">
            Visualizations
          </Tab>
        </Tabs>
        {this.props.children}
      </div>
    );
  }
}

export class Parent extends BaseComponent {
  render() {
    return (
      <div>
        <h2>Parent</h2>
        {this.props.children}
      </div>
    );
  }
}

export class Child extends BaseComponent {
  render() {
    return (
      <div>
        <h2>Child</h2>
        {this.props.children}
      </div>
    );
  }
}
