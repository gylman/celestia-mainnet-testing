import express from 'express';
import axios from 'axios';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json());

const tx = {
  nonce: '0x9',
  gasPrice: '0x4a817c800',
  gasLimit: '0x5208',
  to: '0x88b44BC83add758A3642130619D61682282850Df',
  value: '0x2386f26fc10000',
  data: '0x',
  v: '0x1b',
  r: '0xf5b1b6190f8e620b6c5b3149b6329d577f2b3e6080a5da0b3e2f3ecd6b44f9ac',
  s: '0x1c507769f3b9e62e255c2af5d3ad8fa4db8e4e9bfe3c940dbad12d3b0a27d1ee',
};

const txs = Array(2000)
  .fill(0)
  .map(() => tx);

const namespace = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAtwyT7znK7sA=';
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

// Decode string from base64 format
function decodeBase64(base64String) {
  return Buffer.from(base64String, 'base64').toString('utf-8');
}

// Submit data in base64 encoding to Celestia mainnet
async function submit(data) {
  const base64data = encodeToBase64(JSON.stringify(data));
  const requestBody = {
    id: 1,
    jsonrpc: '2.0',
    method: 'blob.Submit',
    params: [
      [
        {
          namespace: namespace,
          data: base64data,
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
async function getAll(blockHeight) {
  const requestBody = {
    id: 1,
    jsonrpc: '2.0',
    method: 'blob.GetAll',
    params: [blockHeight, [namespace]],
  };
  try {
    const response = await axios.post(url, requestBody, config);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Check balance
async function getBalance() {
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

async function getAccountAddress() {
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

function checkWriteCost() {
  const balance0 = getBalance();
  submit(tx);
  const balance1 = getBalance();
  const spent = balance0 - balance1;
  return spent;
}

function stressTest() {
  // Send multiple requests one after another and check the results
}

function volumeTest() {
  // Send request with different sizes of data and compare the results
}
