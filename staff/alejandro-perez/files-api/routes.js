require('dotenv').config()

const express = require('express')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const {
    logic,
    LogicError
} = require('./logic')
const jwt = require('jsonwebtoken')
const validateJwt = require('./helpers/validate-jwt')

const router = express.Router()

const jsonBodyParser = bodyParser.json()

router.post('/register', jsonBodyParser, (req, res) => {
    const {
        body: {
            username,
            password
        }
    } = req

    logic.register(username, password)
        .then(() => {
            res.status(201).json({
                message: 'user registered'
            })

        })
        .catch((err) => {
            res.status(err instanceof LogicError ? 400 : 500).json({
                "message": err.message
            })
        })

})

router.post('/authenticate', jsonBodyParser, (req, res) => {
    const {
        body: {
            username,
            password
        }
    } = req


    logic.authenticate(username, password)
        .then(() => {
            const {
                JWT_SECRET,
                JWT_EXP
            } = process.env
            const token = jwt.sign({
                sub: username
            }, JWT_SECRET, {
                expiresIn: JWT_EXP
            })
            res.status(200).json({
                message: 'user authenticated',
                token
            })
        })

        .catch((err) => {
            res.status(err instanceof LogicError ? 400 : 500).json({
                "message": err.message
            })
        })
})

router.patch('/user/:username', [validateJwt, jsonBodyParser], (req, res) => {

    const {
        params: {
            username
        },
        body: {
            password,
            newPassword
        }
    } = req
    return logic.updatePassword(username, password, newPassword)
        .then(() => {

            res.status(200).json({
                message: 'user updated'
            })
        })
        .catch((err) => {
            res.status(err instanceof LogicError ? 400 : 500).json({
                "message": err.message
            })
        })
})

router.get('/user/:username/files', validateJwt, async (req, res) => {
    const {
        params: {
            username
        }
    } = req

    const files = await logic.listFiles(username)
        .catch((err) => {
            res.status(err instanceof LogicError ? 400 : 500).json({
                "message": err.message
            })
        })

    res.json(files)

})

router.post('/user/:username/files', [validateJwt, fileUpload()], (req, res) => {
    try {
        const {
            params: {
                username
            },
            files
        } = req
        console.log(req.files)
        if (files && files[""]) {
            return logic.saveFile(username, files[""].name, files[""].data)
                .then(() => {
                    res.status(201).json({
                        message: 'file saved'
                    })
                })
                .catch((err) => {
                    res.status(err instanceof LogicError ? 400 : 500).json({
                        "message": err.message
                    })
                })
        } else {
            res.status(418).json({
                "message": 'no file received'
            })
        }
    } catch (err) {
        res.status(500).json({
            "message": err.message
        })
    }
})

router.get('/user/:username/files/:file', validateJwt, (req, res) => {
    const {
        params: {
            username,
            file
        }
    } = req

    try {
        res.download(logic.getFilePath(username, file))
    } catch ({
        message
    }) {
        res.status(500).json({
            message
        })
    }
})

router.delete('/user/:username/files/:file', validateJwt, (req, res) => {
    debugger
    const {
        params: {
            username,
            file
        }
    } = req

    try {
        logic.removeFile(username, file)

        res.status(200).json({
            message: 'file deleted'
        })
    } catch (err) {
        const {
            message
        } = err

        res.status(err instanceof LogicError ? 400 : 500).json({
            message
        })
    }
})

module.exports = function (db) {
    logic._users = db.collection('users')

    return router
}