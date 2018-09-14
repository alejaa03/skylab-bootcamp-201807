var fs = require('fs')

var str = fs.readFile((process.argv[2]).toString(),"utf-8",function(err,data){
    console.log(data.split("\n").length-1)
})  



