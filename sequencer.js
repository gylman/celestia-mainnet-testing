import express from 'express';
import axios from 'axios';
const app = use(express());
app.use(cors());
app.use(express.json());

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
    const response = await axios.post('RPC_ENDPOINT_URL', requestBody);
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
    const response = await axios.post('RPC_ENDPOINT_URL', requestBody);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

function stressTest() {
  // Send multiple requests one after another and check the results
}

function volumneTest() {
  // Send request with different sizes of data and compare the results
}

Submit();

/* 
    const PORT = 1234;
    app.listen(PORT, () => {
    logSeq('is running on port: ', PORT);
    }); 
*/
