import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './ConditionalSelector.sass';

import SingleConditionalSelector from './SingleConditionalSelector';

export default class ConditionalSelector extends Component {
  render() {
    const { conditionals, fieldProperties } = this.props;

    return (
      <div>
        { conditionals.items.map((conditional, i) =>
          <div key={ `conditional-selector-${ i }` }>
            <SingleConditionalSelector
              fieldId={ conditional.fieldId }
              combinator={ conditional.combinator }
              operator={ conditional.operator }
              value={ conditional.value }
              conditionalIndex={ i }
              fieldProperties={ fieldProperties.items }
            />
          </div>
        ) }
      </div>
    );
  }
}

ConditionalSelector.propTypes = {
  conditionals: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired
};
