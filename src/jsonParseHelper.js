export default (jsonObject) => {
  if (jsonObject) {
    const rows = Object.keys(jsonObject);
    const permissions = 
      rows
      .reduce((acc, val) =>
        acc.concat(jsonObject[val]),
        []
      ).filter(
        (val, index, arr) => arr.indexOf(val) === index
      );
    return [
      ['', ...permissions],
      ...rows.map(row => [row, ...permissions.map(
        perm => jsonObject[row].indexOf(perm) < 0 ? 0 : 1
      )]),
    ];
  }
};

