import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Compose.sass';

import ComposeBlock from './ComposeBlock';

export class ComposeEditor extends Component {
  render() {
    const { composeSelector } = this.props;
    return (
      <div className={ styles.composeEditor }>
        { composeSelector.blocks.length == 0 && 
          <div className={ styles.composeEditorNewDocumentPlaceholder }>
            select a visualization from the sidebar
          </div>
        }
        { composeSelector.blocks.map((block, i) =>
          <ComposeBlock
            key={ `compose-block-${ i }` }
            block={ block }
            updatedAt={ composeSelector.updatedAt } />
        )}
      </div>
    );
  }
}

ComposeEditor.propTypes = {
  composeSelector: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { composeSelector } = state;
  return { composeSelector };
}

export default connect(mapStateToProps, {})(ComposeEditor);
