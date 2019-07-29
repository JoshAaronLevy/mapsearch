function getServerData(agCode) {
  return fetch('/assets/data/sample.txt')
    .then(res => res.text())
    .then(parseListingCsv)
    .then(rows => {
      return rows.map(extractListing).filter(l => l)
    })
}
function parseListingCsv(csv) {
  return csv.split('\n')
}
function extractListing(strRow, index) {
  const row = strRow.split("|");
  if (row.length <= 7) return null;

  return {
    index: index, address: row[9], ln: row[2], lat: row[0], lon: row[1], beds: row[3], baths: row[4], price: row[5], pic: row[7], remarks: row[8], link: row[6]
  }
}
