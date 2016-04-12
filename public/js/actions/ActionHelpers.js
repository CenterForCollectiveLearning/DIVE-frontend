function formatRow(columnNames, row, rowNumber) {
  var newRow = new Object();

  columnNames.forEach(function(columnName, j) {
    const value = row[j];
    const formattedValue = Array.isArray(value)
      ? `Bin ${ rowNumber + 1 }: ${ value[0] } — ${ value[1] }`
      : value;

    newRow[`${ columnName.replace(/[.]/g, '_') }`] = formattedValue;
  });

  return newRow;
}

export function formatTableData(columnNames, data) {
  return data.map((row, rowNumber) =>
    formatRow(columnNames, row, rowNumber)
  );
}
