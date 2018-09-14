'use strict'

const logic = {
    _users: {},

    register(username, password) {
        if(typeof username !== "string" || !username) throw new Error(`invalid username ${username}`)
        if(!password) throw new Error (`blank or invalid password`)
        const user = this._users[username]

        if (user) throw new Error(`user ${username} already exists`)

        this._users[username] = { password }
    },

    login(username, password) {
        const user = this._users[username]

        if (user)
            user.loggedIn = user.password === password
    },

    isLoggedIn(username) {
        return this._users[username] && this._users[username].loggedIn
    },

    logout(username) {
        // TODO
    }
}

module.exports = logic