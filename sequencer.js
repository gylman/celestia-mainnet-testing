import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { txs, txHashes } from './data.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const namespace = process.env.NAMESPACE;
const url = process.env.URL;
const authToken = process.env.AUTH_TOKEN;
const config = {
  headers: {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  },
};

// Encode string to base64 format
function encodeBase64(str) {
  return Buffer.from(str).toString('base64');
}

// Decode string from base64 format
function decodeBase64(base64String) {
  return Buffer.from(base64String, 'base64').toString('utf-8');
}

// Submit data in base64 encoding to Celestia mainnet, returns blockHeight
async function write(data) {
  const base64data = encodeBase64(JSON.stringify(data));
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
        },
      ],
      {
        Fee: 1000000,
        GasLimit: 1000000,
      },
    ],
  };

  try {
    const balance0 = await getBalance();
    const startTime = Date.now();
    const response = await axios.post(url, requestBody, config);
    const endTime = Date.now();
    // const balance1 = await getBalance();
    // const spent = balance0 - balance1;
    const duration = endTime - startTime;
    console.log('Balance before:', balance0);
    console.log('Response:', response.data);
    // console.log(`Request cost ${spent} utia and completed in ${duration} ms`);
    console.log(`Request completed in ${duration} ms`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get all data from the chain using the namespace and block height provided by the response of the submit function
async function read(blockHeight) {
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
    // console.log('This is the balance:', response.data.result.amount);
    return response.data.result.amount;
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

// Store list of 1 transaction and check the spent amount and time
async function _1tx(tx) {
  await write(tx);
}
// Store list of 1 hash and check the spent amount and time
async function _1hash(hash) {
  await write(hash);
}
// Store list of 2000 transaction and check the spent amount and time
async function _2000txs(txs) {
  await write(txs);
}
// Store list of 2000 hashes and check the spent amount and time
async function _2000hashes(hashes) {
  await write(hashes);
}

// _1tx(txs[0]);
await write(txHashes);
// await write(txHashes.slice(0, 10));
