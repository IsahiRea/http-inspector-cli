#!/usr/bin/env node

const axios = require('axios');
const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const measureTime = (start) => {
    const diff = process.hrtime(start);
    return `${(diff[0] * 1e9 + diff[1]) / 1e6} ms`;
};

const prettyPrintJSON = (data) => {
    console.log(chalk.blueBright(JSON.stringify(data, null, 2)));
};

const buildUrlWithParams = (url, params) => {
    if (!params) return url;
    const queryString = new URLSearchParams(JSON.parse(params)).toString();
    return `${url}?${queryString}`;
};

// Flatten nested objects for CSV export
const flattenObject = (obj, parent = '', res = {}) => {
    for (const key in obj) {
        const propName = parent ? `${parent}.${key}` : key;
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            flattenObject(obj[key], propName, res);
        } else if (Array.isArray(obj[key])) {
            res[propName] = JSON.stringify(obj[key]); // Convert arrays to JSON string for CSV compatibility
        } else {
            res[propName] = obj[key];
        }
    }
    return res;
};

const exportToFile = (data, output, format) => {
    const filePath = path.resolve(output);
    
    if (format === 'json') {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(chalk.greenBright(`Response data saved to ${filePath}`));
    } else if (format === 'csv') {
        
        if (!Array.isArray(data)) {
            console.error(chalk.redBright('Error: CSV export requires the response data to be an array of objects.'));
            return;
        }
        
        // Flatten and convert the data to CSV format
        const flattenedData = data.map(row => flattenObject(row));
        const headers = Object.keys(flattenedData[0]).join(',');
        const rows = flattenedData.map(row => Object.values(row).join(',')).join('\n');
        fs.writeFileSync(filePath, `${headers}\n${rows}`);
        console.log(chalk.greenBright(`Response data saved to ${filePath}`));
    } else {
        console.error(chalk.redBright('Unsupported file format. Use json or csv.'));
    }
};

const makeRequest = async (method, url, headers, data, queryParams, auth, output, format) => {
    const start = process.hrtime(); // Start the timer
    try {
        const finalUrl = buildUrlWithParams(url, queryParams);

        const config = {
            method,
            url: finalUrl,
            headers: headers ? JSON.parse(headers) : undefined,
            data: data ? JSON.parse(data) : undefined,
            auth: auth ? JSON.parse(auth) : undefined,
        };

        const response = await axios(config);

        const time = measureTime(start);

        console.log(chalk.greenBright(`Status: ${response.status}`));
        console.log(chalk.greenBright(`Time: ${time}`));
        console.log(chalk.yellow('Headers:'), response.headers);
        console.log(chalk.yellow('Response Data:'));
        prettyPrintJSON(response.data);

        if (output) {
            const exportFormat = format || 'json';
            exportToFile(response.data, output, exportFormat);
        }
    } catch (error) {
        console.error(chalk.redBright(`Error: ${error.message}`));
        if (error.response) {
            console.log(chalk.greenBright(`Status: ${error.response.status}`));
            prettyPrintJSON(error.response.data);
        }
    }
};

program
    .version('1.2.0')
    .description('Extended HTTP Request Inspector CLI with authentication, query params, and file export');

// GET request command
program
    .command('get <url>')
    .description('Send a GET request to a URL')
    .option('-H, --headers <headers>', 'Custom headers in JSON format')
    .option('-Q, --queryParams <queryParams>', 'Query parameters in JSON format')
    .option('-A, --auth <auth>', 'Basic authentication credentials in JSON format (e.g. {"username":"user", "password":"pass"})')
    .option('-T, --token <token>', 'Bearer token for authentication')
    .option('-O, --output <output>', 'File to save the response data (json or csv)')
    .option('-F, --format <format>', 'Format of the output file (json or csv)')
    .action((url, options) => {
        const headers = options.token ? JSON.stringify({ ...JSON.parse(options.headers || '{}'), Authorization: `Bearer ${options.token}` }) : options.headers;
        makeRequest('get', url, headers, null, options.queryParams, options.auth, options.output, options.format);
    });

// POST request command
program
    .command('post <url>')
    .description('Send a POST request to a URL')
    .option('-H, --headers <headers>', 'Custom headers in JSON format')
    .option('-d, --data <data>', 'Request body in JSON format')
    .option('-Q, --queryParams <queryParams>', 'Query parameters in JSON format')
    .option('-A, --auth <auth>', 'Basic authentication credentials in JSON format (e.g. {"username":"user", "password":"pass"})')
    .option('-T, --token <token>', 'Bearer token for authentication')
    .option('-O, --output <output>', 'File to save the response data (json or csv)')
    .option('-F, --format <format>', 'Format of the output file (json or csv)')
    .action((url, options) => {
        const headers = options.token ? JSON.stringify({ ...JSON.parse(options.headers || '{}'), Authorization: `Bearer ${options.token}` }) : options.headers;
        makeRequest('post', url, headers, options.data, options.queryParams, options.auth, options.output, options.format);
    });

// PUT request command
program
    .command('put <url>')
    .description('Send a PUT request to a URL')
    .option('-H, --headers <headers>', 'Custom headers in JSON format')
    .option('-d, --data <data>', 'Request body in JSON format')
    .option('-Q, --queryParams <queryParams>', 'Query parameters in JSON format')
    .option('-A, --auth <auth>', 'Basic authentication credentials in JSON format (e.g. {"username":"user", "password":"pass"})')
    .option('-T, --token <token>', 'Bearer token for authentication')
    .option('-O, --output <output>', 'File to save the response data (json or csv)')
    .option('-F, --format <format>', 'Format of the output file (json or csv)')
    .action((url, options) => {
        const headers = options.token ? JSON.stringify({ ...JSON.parse(options.headers || '{}'), Authorization: `Bearer ${options.token}` }) : options.headers;
        makeRequest('put', url, headers, options.data, options.queryParams, options.auth, options.output, options.format);
    });

// DELETE request command
program
    .command('delete <url>')
    .description('Send a DELETE request to a URL')
    .option('-H, --headers <headers>', 'Custom headers in JSON format')
    .option('-Q, --queryParams <queryParams>', 'Query parameters in JSON format')
    .option('-A, --auth <auth>', 'Basic authentication credentials in JSON format (e.g. {"username":"user", "password":"pass"})')
    .option('-T, --token <token>', 'Bearer token for authentication')
    .option('-O, --output <output>', 'File to save the response data (json or csv)')
    .option('-F, --format <format>', 'Format of the output file (json or csv)')
    .action((url, options) => {
        const headers = options.token ? JSON.stringify({ ...JSON.parse(options.headers || '{}'), Authorization: `Bearer ${options.token}` }) : options.headers;
        makeRequest('delete', url, headers, null, options.queryParams, options.auth, options.output, options.format);
    });

program.parse(process.argv);
