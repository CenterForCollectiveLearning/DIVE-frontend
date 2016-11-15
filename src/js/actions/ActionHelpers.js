function formatVisualizationTableRow(columnNames, row, rowNumber) {
  var newRow = new Object();

  columnNames.forEach(function(columnName, j) {
    const value = row[j];
    var formattedValue;

    if (Array.isArray(value)) {  // Array
      formattedValue = `Bin ${ rowNumber + 1 }: ${ value[0] } — ${ value[1] }`
    } else if (typeof value == 'string' || value instanceof String) {  // String
      // formattedValue = value.replace(/[.]/g, '_');
      formattedValue = value;
    } else if (value === 'number') {  // Object
      formattedValue = value.toString();
    } else if (value === Object(value)) {  // Object
      formattedValue = value['id'];
    } else if (value === undefined || value === null ){
    } else {
      formattedValue = value.toString();
    }
      newRow[columnName] = formattedValue;
  });

  return newRow;
}

export function formatVisualizationTableData(columnNames, data) {
  return data.map((row, rowNumber) =>
    formatVisualizationTableRow(columnNames, row, rowNumber)
  );
}

function formatRow(columnNames, row) {
  var newRow = new Map();

  columnNames.forEach((columnName, j) =>
    newRow.set(`${ columnName.replace(/[.]/g, '_') }`, row[j])
  );

  return newRow;
}

export function formatTableData(columnNames, data) {
  return data.map((row) =>
    formatRow(columnNames, row)
  );
}

export function getFilteredConditionals(conditionals) {
  const validConditionals = conditionals.filter((conditional) =>
    conditional.fieldId && conditional.conditionalId && conditional.value != "ALL_VALUES" && conditional.value != "" && conditional.value != null
  );

  conditionals = null;

  if (validConditionals.length) {
    conditionals = {};

    validConditionals.forEach((conditional) => {
      if (!conditionals[conditional.combinator]) {
        conditionals[conditional.combinator] = [];
      }

      conditionals[conditional.combinator].push({
        'field_id': conditional.fieldId,
        'operation': conditional.operator,
        'criteria': conditional.value
      })
    });
  }
  return conditionals
}
