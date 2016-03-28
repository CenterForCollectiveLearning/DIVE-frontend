import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Compose.sass';

import ComposeBlock from './ComposeBlock';

export class ComposeEditor extends Component {
  render() {
    const { composeSelector, editable } = this.props;
    return (
      <div className={ styles.composeEditor + ' ' + (editable ? styles.editable : '') }>
        { composeSelector.blocks.length == 0 &&
          <div className={ styles.composeEditorNewDocumentPlaceholder }>
            select a visualization from the sidebar
          </div>
        }
        { composeSelector.blocks.map((block) =>
          <ComposeBlock
            key={ `compose-block-${ composeSelector.documentId }-${ block.exportedSpecId }` }
            block={ block }
            editable={ editable }
            updatedAt={ composeSelector.updatedAt } />
        )}
      </div>
    );
  }
}

ComposeEditor.propTypes = {
  composeSelector: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const { composeSelector } = state;
  return { composeSelector };
}

export default connect(mapStateToProps, {})(ComposeEditor);
