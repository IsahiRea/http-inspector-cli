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

        console.log(chalk.greenBright(`Status: ${response.status}`));
        console.log(chalk.yellow('Headers:'), response.headers);
        console.log(chalk.yellow('Response Data:'));
        console.log(chalk.blueBright(JSON.stringify(response.data, null, 2)));
        
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
    .option('-H, --headers <headers>', 'Custom headers in JSON format')
    .option('-D, --data <data>', 'Custom data in JSON format')
    .action((url, options) => {
        makeRequest('post', url, options.headers, options.data);
    })

program
    .command('put <url>')
    .description('Send a PUT request to a URL')
    .option('-H, --headers <headers>', 'Custom headers in JSON format')
    .option('-D, --data <data>', 'Custom data in JSON format')
    .action((url, options) => {
        makeRequest('put', url, options.headers, options.data);
    })
    

program
    .command('delete <url>')
    .description('Send a DELETE request to a URL ')
    .option('-H, --headers <headers>', 'Custom headers in JSON format')
    .action((url, options) => {
        makeRequest('delete', url, options.headers, null);
    })

// Parse the CLI arguments
program.parse(process.argv);