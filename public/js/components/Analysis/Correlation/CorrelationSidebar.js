import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import { selectCorrelationVariable } from '../../../actions/CorrelationActions';
import styles from '../Analysis.sass';

import AnalysisSidebar from '../AnalysisSidebar';
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
    const quantitativeVariables = this.props.fieldProperties.items.filter((item) => item.generalType == 'q')
    return (
      <AnalysisSidebar selectedTab="correlation">
        { this.props.fieldProperties.items.length != 0 &&
          <SidebarGroup heading="Correlation Variables">
            <ToggleButtonGroup
              toggleItems={ quantitativeVariables.map((item) =>
                new Object({
                  id: item.id,
                  name: item.name
                })
              )}
              valueMember="id"
              displayTextMember="name"
              externalSelectedItems={ this.props.correlationSelector.correlationVariableIds }
              onChange={ this.props.selectCorrelationVariable } />
          </SidebarGroup>
        }
      </AnalysisSidebar>
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
