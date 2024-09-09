# HTTP Request Inspector CLI

HTTP Request Inspector is a command-line tool designed for sending and inspecting HTTP requests. It supports multiple HTTP methods (GET, POST, PUT, DELETE), custom headers, query parameters, and both Basic and Bearer token authentication. The tool provides a clean, readable output with status codes, response headers, and optionally formatted response data (JSON).

### Features
 - Send HTTP requests using GET, POST, PUT, and DELETE methods.
 - Display status codes, response headers, and response body.

### Installation
1. **Clone the repository or download the source code:**
    `git clone https://github.com/yourusername/http-inspector.git`\
    `cd http-inspector`
2. **Install dependencies:**
    `npm install`
3. **(Optional) Install globally for easier use:**
    `npm install -g .`

### Usage
Run the tool using: ./http_inspector.js <command> <url> [options]\
If installed globally, you can simply run: http_inspector <command> <url> [options]

### Supported Commands
 - get
 - post
 - put
 - delete