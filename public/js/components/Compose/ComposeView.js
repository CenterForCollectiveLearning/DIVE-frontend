import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Compose.sass';

import Card from '../Base/Card';
import HeaderBar from '../Base/HeaderBar';
import ComposeEditor from './ComposeEditor';

export class ComposeView extends Component {
  render() {
    const { composeSelector } = this.props;
    const saveStatus = composeSelector.saving ? 'Saving': 'Saved';
    return (
      <div className={ styles.composeViewContainer }>
        <Card>
          <HeaderBar
            header={ <span>New Document</span> }
            actions={
              <span className={ styles.saveStatus }>{ saveStatus }</span>
            }
          />
          <ComposeEditor />
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { composeSelector } = state;
  return { composeSelector };
}

export default connect(mapStateToProps, {})(ComposeView);
