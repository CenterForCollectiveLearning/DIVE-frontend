import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Compose.sass';

import Card from '../Base/Card';
import HeaderBar from '../Base/HeaderBar';
import ComposeEditor from './ComposeEditor';

export class ComposeView extends Component {
  render() {
    return (
      <div className={ styles.composeViewContainer }>
        <Card>
          <HeaderBar header={ <span>New Document</span> } />
          <ComposeEditor />
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { };
}

export default connect(mapStateToProps, { })(ComposeView);
