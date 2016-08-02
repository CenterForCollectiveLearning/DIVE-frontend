import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { selectCorrelationVariable } from '../../../actions/CorrelationActions';
import styles from '../Analysis.sass';

import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';

export class CorrelationSidebar extends Component {
  componentWillMount(props) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = this.props;

    if (project.properties.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = nextProps;
    const datasetIdChanged = datasetSelector.datasetId != this.props.datasetSelector.datasetId;

    if (project.properties.id && datasetSelector.datasetId && (datasetIdChanged || !fieldProperties.items.length) && !fieldProperties.fetching) {
      fetchFieldPropertiesIfNeeded(project.properties.id, datasetSelector.datasetId)
    }
  }

  render() {
    const { fieldProperties, selectCorrelationVariable, correlationSelector } = this.props;
    const quantitativeVariables = this.props.fieldProperties.items.filter((item) => item.generalType == 'q')
    return (
      <Sidebar selectedTab="correlation">
        { fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Correlation Variables">
            { fieldProperties.items.filter((property) => property.generalType == 'q').length > 0 &&
              <div className={ styles.fieldGroup }>
                <div className={ styles.fieldGroupLabel }>Quantitative</div>
                <ToggleButtonGroup
                  toggleItems={ quantitativeVariables.map((item) =>
                    new Object({
                      id: item.id,
                      name: item.name,
                      color: item.color
                    })
                  )}
                  valueMember="id"
                  colorMember="color"
                  displayTextMember="name"
                  externalSelectedItems={ correlationSelector.correlationVariableIds }
                  separated={ true }
                  onChange={ selectCorrelationVariable } />
              </div>
            }
          </SidebarGroup>
        }


      </Sidebar>
    );
  }
}

CorrelationSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  fieldProperties: PropTypes.object.isRequired,
  correlationSelector: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, datasetSelector, fieldProperties, correlationSelector } = state;
  return {
    project,
    datasetSelector,
    fieldProperties,
    correlationSelector
  };
}

export default connect(mapStateToProps, { fetchFieldPropertiesIfNeeded, selectCorrelationVariable })(CorrelationSidebar);
