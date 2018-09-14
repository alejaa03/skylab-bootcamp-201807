const http = require("http")
const fs  = require("fs")
// const morgan = require("morgan")


const { argv: [,, port]} = process

http.createServer((req,res) =>{
    if(req.method === "POST"){
        const ws = fs.createWriteStream("file.data")
        req.pipe(ws)
        // res.end("GOT IT")
        req.on("end", () => res.end("OK"))
    }
}).listen((port), () => console.log(`Server on port ${port}`) )