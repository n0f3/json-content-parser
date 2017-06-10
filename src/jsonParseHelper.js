export default (jsonObject) => {
  if (jsonObject) {
    const rows = Object.keys(jsonObject);
    const columns = [
      ...new Set(rows.map(
        key => jsonObject[key]
        ).reduce((acc, val) => acc.concat(...val))
      )
    ];
    const dataSheet = [[
      '',
      ...columns
    ]];
    let rowData = [];
    rows.forEach((row) => {
      // adding initial row name identifier
      rowData.push(row);
      // filling rest of array with 0
      rowData.fill(0, 1, columns.length);
      rowData.push(...columns.map((column) => jsonObject[row].includes(column) ?
        1 : 0));
      dataSheet.push(rowData);
      rowData = [];
    });
    console.table(dataSheet);
    return dataSheet;
  }
};
