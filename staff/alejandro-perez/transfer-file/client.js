const http = require("http")
const fs  = require("fs")

const { argv: [,, file, url,port]} = process

const postData = fs.readFileSync(file)

const options = {

    hostname: url,
    port: parseInt(port),
    path: "/",
    method: "POST"

}

const req = http.request(options, res => {
    let content = ""
    res.setEncoding('utf8');
    res.on('data', chunk => {
        content += chunk
    });
    res.on('end', () => {
        console.log(content)
    });
  });
  
  req.on('error', ({message}) => {
    console.error(`problem with request: ${message}`);
  });

req.write(postData);
req.end();
