import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Compose.sass';

import Card from '../Base/Card';
import HeaderBar from '../Base/HeaderBar';
import ComposeEditor from './ComposeEditor';
import Input from '../Base/Input';

export class ComposeView extends Component {
  constructor(props) {
    super(props);

    const heading = this.props.selectedDocument ? this.props.selectedDocument.title : 'New Document';

    this.state = {
      documentHeading: heading
    }
  }

  onTitleChange(event) {
    this.setState({ documentHeading: event.target.value });
  }

  render() {
    const { composeSelector } = this.props;
    const editable = composeSelector.editable;
    const saveStatus = composeSelector.saving ? 'Saving': 'Saved';
    return (
      <div className={ styles.composeViewContainer }>
        <Card>
        { editable &&
          <HeaderBar
            className={ styles.editorHeader + ' ' + styles.editable}
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
          }
          { !editable &&
            <HeaderBar
              className={ styles.editorHeader}
              textClassName={ styles.editorHeaderText }
              header={
                <div className={ styles.documentTitle }>
                  { this.state.documentHeading }
                </div>
              }
            />
          }
          <ComposeEditor/>
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

export default connect(mapStateToProps, {})(ComposeView);
