#!/usr/bin/env node

const {program} = require('commander');
const axios = require('axios');
const chalk = require('chalk');

// Helper function to add query parameters to the URL
const buildUrlWithParams = (url, params) => {
    if (!params) return url;
    const queryString = new URLSearchParams(JSON.parse(params)).toString();
    return `${url}?${queryString}`;
};

// Create a function to handle requests
const makeRequest = async (method, url, headers, data, queryParams, auth) => {
    
    try {
        // Build URL with query parameters
        const finalUrl = buildUrlWithParams(url, queryParams);

        const response = await axios({
            method,
            url: finalUrl,
            headers: headers ? JSON.parse(headers) : undefined,
            data: data ? JSON.parse(data) : undefined,
            auth: auth ? JSON.parse(auth) : undefined,
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
    .version('1.1.0')
    .description('HTTP Request Inspector CLI')

program
    .command('get <url>')
    .description('Send a GET request to a URL')
    .option('-H, --headers <headers>', 'Custom headers in JSON format')
    .option('-Q, --queryParams <queryParams>', 'Query parameters in JSON format')
    .option('-A, --auth <auth>', 'Basic authentication credentials in JSON format (e.g. {"username":"user", "password":"pass"})')
    .option('-T, --token <token>', 'Bearer token for authentication')
    .action((url, options) => {
        const headers = options.token ? JSON.stringify({ ...JSON.parse(options.headers || '{}'), Authorization: `Bearer ${options.token}` }) : options.headers;
        makeRequest('get', url, headers, null, options.queryParams, options.auth);
    })

program
    .command('post <url>')
    .description('Send a POST request to a URL ')
    .option('-H, --headers <headers>', 'Custom headers in JSON format')
    .option('-D, --data <data>', 'Custom data in JSON format')
    .option('-Q, --queryParams <queryParams>', 'Query parameters in JSON format')
    .option('-A, --auth <auth>', 'Basic authentication credentials in JSON format (e.g. {"username":"user", "password":"pass"})')
    .option('-T, --token <token>', 'Bearer token for authentication')
    .action((url, options) => {
        const headers = options.token ? JSON.stringify({ ...JSON.parse(options.headers || '{}'), Authorization: `Bearer ${options.token}` }) : options.headers;
        makeRequest('post', url, headers, options.data, options.queryParams, options.auth);
    })

program
    .command('put <url>')
    .description('Send a PUT request to a URL')
    .option('-H, --headers <headers>', 'Custom headers in JSON format')
    .option('-D, --data <data>', 'Custom data in JSON format')
    .option('-Q, --queryParams <queryParams>', 'Query parameters in JSON format')
    .option('-A, --auth <auth>', 'Basic authentication credentials in JSON format (e.g. {"username":"user", "password":"pass"})')
    .option('-T, --token <token>', 'Bearer token for authentication')
    .action((url, options) => {
        const headers = options.token ? JSON.stringify({ ...JSON.parse(options.headers || '{}'), Authorization: `Bearer ${options.token}` }) : options.headers;
        makeRequest('put', url, headers, options.data, options.queryParams, options.auth);
    })
    

program
    .command('delete <url>')
    .description('Send a DELETE request to a URL ')
    .option('-H, --headers <headers>', 'Custom headers in JSON format')
    .option('-Q, --queryParams <queryParams>', 'Query parameters in JSON format')
    .option('-A, --auth <auth>', 'Basic authentication credentials in JSON format (e.g. {"username":"user", "password":"pass"})')
    .option('-T, --token <token>', 'Bearer token for authentication')
    .action((url, options) => {
        const headers = options.token ? JSON.stringify({ ...JSON.parse(options.headers || '{}'), Authorization: `Bearer ${options.token}` }) : options.headers;
        makeRequest('delete', url, headers, null, options.queryParams, options.auth);
    })

// Parse the CLI arguments
program.parse(process.argv);