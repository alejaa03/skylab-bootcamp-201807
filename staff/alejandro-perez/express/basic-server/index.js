const express = require("express")
const fs = require('fs')
const fileUpload = require("express-fileupload")
const app = express()

app.use(fileUpload())


app.get("/files/:file", (req,res) => {
    const {file} = req.params
    // res.download(`${__dirname}/files/${file}`)
    res.download(`files/${file}`)
    
})

app.get('/files/delete/:file', function (req, res) {
    const {params:{file}} = req
    fs.unlinkSync(`${__dirname}/files/${file}`);
    res.redirect(`/files`)
});

app.get("/files", (req, res) => {
    const files = fs.readdirSync('files')
    res.send(`<html>
    <head>
        <title>files</title>
    </head>
    <body>
        <ul>
            ${files.map(file => `<li><a href="/files/${file}">${file}</li></a> <a href="/files/delete/${file}">DELETE</a>`).join('')}
        </ul>

        <form action="/files" method="POST" enctype="multipart/form-data" >
        Select an image to upload:
        <input type="file" name="upload"> 
        <input type="submit" value="Upload Image">
      </form>

    </body>
</html>

  `)
})



app.post("/files", (req, res) => {
    const {files: { upload } } = req
    upload.mv(`${__dirname}/files/${upload.name}`, function (err) {
        if (err)
            return res.status(500).send(err);

        res.redirect("/files");
    });
})

app.listen(3000)