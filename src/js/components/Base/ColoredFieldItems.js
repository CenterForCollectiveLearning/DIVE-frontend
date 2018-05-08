import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import styles from './ColoredFieldItems.sass';
import { useWhiteFontFromBackgroundHex, formatListWithCommas } from '../../helpers/helpers';

export class ColoredFieldItems extends Component {
  render() {
    const { fields, fieldNameToColor } = this.props;
    const numFields = fields.length;
    const rawColoredFieldSpans = fields.map(function(field, i) {
      var style = {}
      if (fieldNameToColor && field in fieldNameToColor) {
        var backgroundColor = fieldNameToColor[field];
        var whiteFont=false;
        try {
          whiteFont = useWhiteFontFromBackgroundHex(backgroundColor);
        } catch (e) {
        }
        style['backgroundColor'] = backgroundColor
      }

      return <span
        style={ style }
        key={ `field-name-${ field }-${ i }` }
        className={
          styles.coloredFieldItem
          + ' ' + ( whiteFont ? styles.whiteFont : styles.blackFont )
      }>{ field }</span>
    });

    return (<span>{ formatListWithCommas(rawColoredFieldSpans) }</span>);
  }
}

ColoredFieldItems.propTypes = {
  fields: PropTypes.array.isRequired,
};

ColoredFieldItems.defaultProps = {
  fields: []
}

function mapStateToProps(state) {
  const { fieldProperties } = state;
  return {
    fieldNameToColor: fieldProperties.fieldNameToColor
  };
}

export default connect(mapStateToProps, {})(ColoredFieldItems);
