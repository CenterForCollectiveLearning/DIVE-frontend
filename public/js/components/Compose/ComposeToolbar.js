import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import styles from './Compose.sass';

import Toolbar from '../Base/Toolbar';
import DropDownMenu from '../Base/DropDownMenu';
import RaisedButton from '../Base/RaisedButton';

export class ComposeToolbar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {

    return (
      <Toolbar className={ styles.composeToolbar } foreground={ true }>
        <div className={ styles.leftActions }>
          <span>Document: </span>
          <div className={ styles.documentSelectorContainer }>
          </div>
          <RaisedButton label="New document" />
        </div>
      </Toolbar>
    );
  }
}

ComposeToolbar.propTypes = {
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, { pushState })(ComposeToolbar);
