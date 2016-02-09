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
