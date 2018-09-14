'use strict'

const logic = require('.')
const { expect } = require('chai')

describe('logic', () => {
    beforeEach(() => {
        logic.users = {}
        const username = "jack",password="123"
    })

    describe('register', () => {

        it('should register', () => {
            expect(logic.users[username]).not.to.exist

            logic.register(username, password)

            const user = logic.users[username]

            expect(user).to.exist
            expect(user.password).to.equal(password)
        })

        it('should fail on already existing user register attempt', () => {
            logic.register(username,password)
            expect(() => logic.register(username,password).to.throw(`user ${username} already exists`))
        })

        
    })
})