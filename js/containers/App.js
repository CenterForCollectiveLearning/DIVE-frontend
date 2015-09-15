import React, { Component } from 'react';

import { Link } from 'react-router';
import { connect } from 'react-redux';

@connect(state => ({ routerState: state.router }))
export class App extends Component {
  render() {
    const links = [
      '/',
      '/parent?foo=bar',
      '/parent/child?bar=baz',
      '/parent/child/123?baz=foo'
    ].map(l =>
      <p>
        <Link to={l}>{l}</Link>
      </p>
    );

    return (
      <div>
        <h1>App Container</h1>
        {links}
        {this.props.children}
      </div>
    );
  }
}

export class Parent extends Component {
  render() {
    return (
      <div>
        <h2>Parent</h2>
        {this.props.children}
      </div>
    );
  }
}

export class Child extends Component {
  render() {
    return (
      <div>
        <h2>Child</h2>
        {this.props.children}
      </div>
    );
  }
}
