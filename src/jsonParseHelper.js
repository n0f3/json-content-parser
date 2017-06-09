export default (jsonObject) => {
  if (jsonObject) {
      const columns = new Set();
      const rows = Object.keys(jsonObject);
      
      rows.forEach((key) => {
        const values = jsonObject[key];
        if (values) {
          values.forEach((val) => {
            columns.add(val);
          });
        }
      });
      
      const dataSheet = [];
      dataSheet.push(['', ...columns.values()]);
      let rowData = [];
      rows.forEach((row) => {
        rowData.push(row);
        [...columns.values()].forEach((column) => {
          if (jsonObject[row].find((val) => val === column)) {
            rowData.push(1);
          } else {
            rowData.push(0);
          }
        });
        dataSheet.push(rowData);
        rowData = [];
      });
      return dataSheet;
    }
};
