import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Compose.sass';

import Card from '../Base/Card';
import HeaderBar from '../Base/HeaderBar';
import ComposeEditor from './ComposeEditor';
import Input from '../Base/Input';
import _ from 'underscore';

import { saveDocumentTitle } from '../../actions/ComposeActions';

export class ComposeView extends Component {
  constructor(props) {
    super(props);
    
    const heading = this.props.selectedDocument ? this.props.selectedDocument.title : 'New Document';

    this.saveDocumentTitle = _.debounce(this.props.saveDocumentTitle, 800);

    this.state = {
      documentHeading: heading
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedDocument } = nextProps;
    if (selectedDocument && (!this.props.selectedDocument || (selectedDocument.title != this.props.selectedDocument.title))) {
      this.setState({ documentHeading: selectedDocument.title });
    }
  }

  onTitleChange(event) {
    this.setState({ documentHeading: event.target.value });
    this.saveDocumentTitle(this.props.selectedDocument.id, this.state.documentHeading);
  }

  render() {
    const { composeSelector } = this.props;
    const saveStatus = composeSelector.saving ? 'Saving': 'Saved';
    return (
      <div className={ styles.composeViewContainer }>
        <Card>
          <HeaderBar
            className={ styles.editorHeader }
            textClassName={ styles.editorHeaderText }
            header={
              <Input
                className={ styles.documentTitle }
                type="text"
                value={ this.state.documentHeading }
                onChange={ this.onTitleChange.bind(this) }/>
            }
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
  const { composeSelector, documents } = state;
  const selectedDocument = documents.items.find((doc) => doc.id == composeSelector.documentId);
  return { composeSelector, selectedDocument: selectedDocument };
}

export default connect(mapStateToProps, { saveDocumentTitle })(ComposeView);
