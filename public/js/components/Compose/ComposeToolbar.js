import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { createNewDocument } from '../../actions/ComposeActions';
import styles from './Compose.sass';

import Toolbar from '../Base/Toolbar';
import DropDownMenu from '../Base/DropDownMenu';
import RaisedButton from '../Base/RaisedButton';

export class ComposeToolbar extends Component {
  constructor(props) {
    super(props);
    this.onClickNewDocument = this.onClickNewDocument.bind(this);
  }

  componentWillMount() {
  }

  onClickNewDocument() {
    const { projectId } = this.props;
    createNewDocument(projectId);
  }

  render() {
    const { onClickNewDocument } = this.props;

    return (
      <Toolbar className={ styles.composeToolbar }>
        <div className={ styles.leftActions }>
          <span>Document: </span>
          <div className={ styles.documentSelectorContainer }>
          </div>
          <RaisedButton label="New document" onClick={ this.onClickNewDocument } />
        </div>
      </Toolbar>
    );
  }
}

ComposeToolbar.propTypes = {
  projectId: PropTypes.string
};

function mapStateToProps(state) {
  const { project } = state;
  return {
    projectId: (project.properties.id ? `${ project.properties.id }` : null)
  };
}

export default connect(mapStateToProps, { pushState, createNewDocument })(ComposeToolbar);
