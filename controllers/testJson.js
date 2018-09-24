const fs = require('fs');

fs.readFile('jsonString.txt', (err, data) => {
  JSON.parse(data);
});
