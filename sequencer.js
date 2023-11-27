import express from 'express';
import axios from 'axios';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());

const url = 'http://localhost:26657';
const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJwdWJsaWMiLCJyZWFkIiwid3JpdGUiLCJhZG1pbiJdfQ.-1CtqTvYBqLC0N1cuT8te0fKQMQx97lPUWSAAKTknWo';
const config = {
  headers: {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  },
};

// Encode string to base64 format
function encodeToBase64(str) {
  return Buffer.from(str).toString('base64');
}

// Submit data in base64 encoding to Celestia mainnet
async function submit() {
  const requestBody = {
    id: 1,
    jsonrpc: '2.0',
    method: 'blob.Submit',
    params: [
      [
        {
          namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAECAwQFBgcICRA=',
          data: 'VGhpcyBpcyBhbiBleGFtcGxlIG9mIHNvbWUgYmxvYiBkYXRh',
          share_version: 0,
          commitment: 'AD5EzbG0/EMvpw0p8NIjMVnoCP4Bv6K+V6gjmwdXUKU=',
        },
      ],
      {
        Fee: 42,
        GasLimit: 42,
      },
    ],
  };

  try {
    const response = await axios.post(url, requestBody, config);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get all data from the chain using the namespace and block height provided by the response of the submit function
async function getAll() {
  const requestBody = {
    id: 1,
    jsonrpc: '2.0',
    method: 'blob.GetAll',
    params: [42, ['AAAAAAAAAAAAAAAAAAAAAAAAAAECAwQFBgcICRA=']],
  };
  try {
    const response = await axios.post(url, requestBody, config);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Check balance
async function balance() {
  const requestBody = {
    id: 1,
    jsonrpc: '2.0',
    method: 'state.Balance',
    params: [],
  };
  try {
    const response = await axios.post(url, requestBody, config);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function accountAddress() {
  const requestBody = {
    id: 1,
    jsonrpc: '2.0',
    method: 'state.AccountAddress',
    params: [],
  };
  try {
    const response = await axios.post(url, requestBody, config);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

function stressTest() {
  // Send multiple requests one after another and check the results
}

function volumeTest() {
  // Send request with different sizes of data and compare the results
}
balance();
// accountAddress();

/* 
    const PORT = 1234;
    app.listen(PORT, () => {
    logSeq('is running on port: ', PORT);
    }); 
*/
