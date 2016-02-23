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

    const { composeSelector, documents, editable } = this.props;
    const selectedDocument = editable ? documents.items.find((doc) => doc.id == composeSelector.documentId) : composeSelector;

    console.log('Selected document', selectedDocument);
    const heading = selectedDocument ? selectedDocument.title : 'New Document';

    this.saveDocumentTitle = _.debounce(this.props.saveDocumentTitle, 500);

    this.state = {
      selectedDocument: selectedDocument,
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
    const heading = event.target.value;
    this.setState({ documentHeading: heading });
    this.saveDocumentTitle(this.props.selectedDocument.id, heading);
  }

  render() {
    const { composeSelector, editable } = this.props;
    const saveStatus = composeSelector.saving ? 'Saving': 'Saved';
    return (
      <div className={ styles.composeViewContainer }>
        <Card>
          <HeaderBar
            className={ styles.editorHeader + ' ' + ( editable ? styles.editable : ' ' ) }
            textClassName={ styles.editorHeaderText }
            header={
              <Input
                className={ styles.documentTitle }
                readonly={ !editable }
                type="text"
                value={ this.state.documentHeading }
                onChange={ this.onTitleChange.bind(this) }/>
              }
              actions={ editable &&
                <span className={ styles.saveStatus }>{ saveStatus }</span>
              }
            />
          <ComposeEditor editable={ editable }/>
        </Card>
      </div>
    );
  }
}

ComposeView.propTypes = {
  editable: PropTypes.bool
}

function mapStateToProps(state) {
  const { composeSelector, documents } = state;
  return { composeSelector, documents };
}

export default connect(mapStateToProps, { saveDocumentTitle })(ComposeView);
