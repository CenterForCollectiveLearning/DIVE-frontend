import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Conditionals.sass';

import ConditionalSelector from './ConditionalSelector';

export class Conditionals extends Component {
  render() {
    const { conditionals } = this.props;

    return (
      { conditionals.items.map((conditional, i) =>
        <div key={ `conditional-selector-${ i }` }>
          <ConditionalSelector
            fieldId={ conditional.fieldId }
            combinator={ conditional.combinator }
            operator={ conditional.operator }
            value={ conditional.value }
            conditionalIndex={ i }
            fieldProperties={ fieldProperties.items }
            selectConditionalValue={ selectConditional }/>
        </div>
      ) }
    );
  }
}

Conditionals.propTypes = {
  conditionals: PropTypes.array.isRequired,
};

function mapStateToProps(state) { return {} };

export default connect(mapStateToProps, { })(Conditionals);
