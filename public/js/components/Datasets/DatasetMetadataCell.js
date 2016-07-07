import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import styles from './Datasets.sass';
import DropDownMenu from '../Base/DropDownMenu';
import { setFieldType } from '../../actions/FieldPropertiesActions';

export class DatasetMetadataCell extends Component {
  constructor (props) {
    super(props);
  }



  render() {
    const { fieldProperty } = this.props;
    const { generalType, typeScores, isId, isChild, isUnique, stats, uniqueValues } = fieldProperty;

    let fieldContent;
    if ( generalType == 'c' ) {
      const uniqueValuesCount = uniqueValues.length;
      fieldContent =
        <div className={ styles.uniqueValuesList }>
         { isUnique &&
            <div>
              Unique
            </div>
          }
          <div>
            { uniqueValuesCount } unique values
          </div>
          <div>
            <ul>
              { uniqueValues.slice(0, 5).map((value, i) =>
                <li>{ value }</li>
              )}
            </ul>
            { (uniqueValuesCount > 5) &&
              <span>{ uniqueValuesCount - 5 } more.</span>
            }
          </div>
        </div>
    } else if ( generalType == 'q' ) {
      fieldContent =
        <div>
          Q Field
        </div>
    } else if ( generalType == 't' ) {
      fieldContent = <div>T Field</div>
    }

    return (
      <div>
        { fieldContent }
      </div>
    );
  }
}

DatasetMetadataCell.propTypes = {
  fieldProperty: PropTypes.object
}

DatasetMetadataCell.defaultProps = {
  fieldProperty: {}
}

function mapStateToProps(state) {
  return { projectId: state.project.properties.id };
}

export default connect(mapStateToProps, { setFieldType })(DatasetMetadataCell);
