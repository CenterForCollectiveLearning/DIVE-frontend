import {
  SELECT_FIELD_PROPERTY,
  REQUEST_FIELD_PROPERTIES,
  RECEIVE_FIELD_PROPERTIES,
  SELECT_FIELD_PROPERTY_VALUE,
  SELECT_AGGREGATION_FUNCTION,
  REQUEST_SET_FIELD_TYPE,
  RECEIVE_SET_FIELD_TYPE,
  REQUEST_SET_FIELD_IS_ID,
  RECEIVE_SET_FIELD_IS_ID
} from '../constants/ActionTypes';

import { fetch } from './api.js';

function requestFieldPropertiesDispatcher() {
  return {
    type: REQUEST_FIELD_PROPERTIES,
    requestedAt: Date.now()
  };
}

function receiveFieldPropertiesDispatcher(projectId, datasetId, json, selectedFieldPropertyNames) {

  const AGGREGATIONS = [
    {
      value: "ALL_TYPES",
      label: "All Types",
      selected: true
    },
    {
      value: "AVG",
      label: "mean",
      selected: false
    },
    {
      value: "MIN",
      label: "min",
      selected: false
    },
    {
      value: "MAX",
      label: "max",
      selected: false
    }
  ];

  const allValuesMenuItem = {
    selected: true,
    value: "ALL_VALUES",
    label: "All Values"
  };

  const cFieldProperties = json.fieldProperties
    .filter((property) => property.generalType == 'c')
    .map((property) =>
      new Object({
        ...property,
        selected: selectedFieldPropertyNames.indexOf(property.name) >= 0,
        values: property.uniqueValues ? [allValuesMenuItem, ...property.uniqueValues.map((value, i) =>
          new Object({
            selected: false,
            value: `${ value }`,
            label: value
          })
        )] : [allValuesMenuItem]
      })
    );

    const tFieldProperties = json.fieldProperties
      .filter((property) => property.generalType == 't')
      .map((property) =>
        new Object({
          ...property,
          selected: selectedFieldPropertyNames.indexOf(property.name) >= 0,
          aggregations: AGGREGATIONS
        })
      );


  const qFieldProperties = json.fieldProperties
    .filter((property) => property.generalType == 'q')
    .map((property) =>
      new Object({
        ...property,
        selected: selectedFieldPropertyNames.indexOf(property.name) >= 0,
        aggregations: AGGREGATIONS
      })
    );


  return {
    type: RECEIVE_FIELD_PROPERTIES,
    projectId: projectId,
    datasetId: datasetId,
    fieldProperties: [ ...cFieldProperties, ...tFieldProperties, ...qFieldProperties ],
    receivedAt: Date.now()
  };
}

export function fetchFieldProperties(projectId, datasetId, selectedFieldPropertyNames) {
  return dispatch => {
    dispatch(requestFieldPropertiesDispatcher());
    return fetch(`/field_properties/v1/field_properties?project_id=${projectId}&dataset_id=${datasetId}`)
      .then(json => dispatch(receiveFieldPropertiesDispatcher(projectId, datasetId, json, selectedFieldPropertyNames)));
  };
}

function shouldFetchFieldProperties(state) {
  const fieldProperties = state.fieldProperties;
  if (fieldProperties.isFetching) {
    return false;
  }
  return true;
}

export function fetchFieldPropertiesIfNeeded(projectId, datasetId, selectedFieldPropertyNames=[]) {
  return (dispatch, getState) => {
    if (shouldFetchFieldProperties(getState())) {
      return dispatch(fetchFieldProperties(projectId, datasetId, selectedFieldPropertyNames));
    }
  };
}

export function selectFieldProperty(selectedFieldPropertyId) {
  return {
    type: SELECT_FIELD_PROPERTY,
    selectedFieldPropertyId: selectedFieldPropertyId,
    receivedAt: Date.now()
  }
}

export function selectFieldPropertyValue(selectedFieldPropertyId, selectedFieldPropertyValueId) {
  return {
    type: SELECT_FIELD_PROPERTY_VALUE,
    selectedFieldPropertyId: selectedFieldPropertyId,
    selectedFieldPropertyValueId: selectedFieldPropertyValueId
  }
}

export function selectAggregationFunction(selectedFieldPropertyId, selectedFieldPropertyValueId) {
  return {
    type: SELECT_AGGREGATION_FUNCTION,
    selectedFieldPropertyId: selectedFieldPropertyId,
    selectedFieldPropertyValueId: selectedFieldPropertyValueId
  }
}

function requestSetFieldTypeDispatcher(projectId, fieldId, fieldType) {
  return {
    type: REQUEST_SET_FIELD_TYPE,
    fieldId: fieldId,
    fieldType: fieldType
  };
}

function receiveSetFieldTypeDispatcher(fieldProperty) {
  return {
    type: RECEIVE_SET_FIELD_TYPE,
    fieldProperty: fieldProperty
  };
}

export function setFieldType(projectId, fieldId, fieldType) {
  const params = {
    project_id: projectId,
    type: fieldType
  };

  return (dispatch) => {
    dispatch(requestSetFieldTypeDispatcher(projectId, fieldId, fieldType));
    return fetch(`/datasets/v1/fields/${ fieldId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveSetFieldTypeDispatcher(json)));
  };
}

function requestSetFieldIsIdDispatcher(projectId, fieldId, fieldIsId) {
  return {
    type: REQUEST_SET_FIELD_IS_ID,
    fieldId: fieldId,
    fieldIsId: fieldIsId
  };
}

function receiveSetFieldIsIdDispatcher(fieldProperty) {
  return {
    type: RECEIVE_SET_FIELD_IS_ID,
    fieldProperty: fieldProperty
  };
}

export function setFieldIsId(projectId, fieldId, fieldIsId) {
  const params = {
    project_id: projectId,
    isId: fieldIsId
  };

  return (dispatch) => {
    dispatch(requestSetFieldIsIdDispatcher(projectId, fieldId, fieldIsId));
    return fetch(`/datasets/v1/fields/${ fieldId }`, {
      method: 'post',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' }
    }).then(json => dispatch(receiveSetFieldIsIdDispatcher(json)));
  };
}
