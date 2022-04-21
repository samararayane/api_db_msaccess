'use strict';
 
const ADODB = require('node-adodb');
ADODB.debug = true;

const PATH = 'C:\\Users\\Samy\\Downloads\\bd\\galileo-00\\Elgal.mdb;';

const connection = ADODB.open(`Provider=Microsoft.ACE.Oledb.12.0;Data Source=${PATH}`, process.arch.includes('64'));

async function query() {
  try {
    const result = await connection.query('SELECT TOP 1 * FROM [Irrigation Information]');
 
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
}
 
query();
