#!/usr/bin/env node

const {program} = require('commander');
const axios = require('axios');
const chalk = require('chalk');

// Create a function to handle requests
const makeRequest = async (method, url, headers, data) => {
    
    try {
        const response = await axios({
            method,
            url,
            headers: headers ? JSON.parse(headers) : undefined,
            data: data ? JSON.parse(data) : undefined,
        });
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};


program
    .version('1.0.0')
    .description('HTTP Request Inspector CLI')

program
    .command('get <url>')
    .description('Send a GET request to a URL')
    .option('-H, --headers <headers>', 'Custom headers in JSON format')
    .action((url, options) => {
        makeRequest('get', url, options.headers, null);
    })

program
    .command('post <url>')
    .description('Send a POST request to a URL ')

program
    .command('put <url>')
    .description('Send a PUT request to a URL')

program
    .command('delete <url>')
    .description('Send a DELETE request to a URL ')

// Parse the CLI arguments
program.parse(process.argv);