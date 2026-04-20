const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

module.exports = cds.service.impl(async function () {

    const { Users } = this.entities;

    this.on('register', async (req) => {

        let { username, password } = req.data;

        username = username.trim();
        password = password.trim();

        if (!username || !password) return false;

        const existing = await SELECT.one.from(Users).where({ username });

        if (existing) return false;

        await INSERT.into(Users).entries({
            ID: uuidv4(),
            username,
            password
        });

        return true;
    });

    this.on('login', async (req) => {

        let { username, password } = req.data;

        // ✅ trim inputs (IMPORTANT)
        username = username.trim();
        password = password.trim();

        const user = await SELECT.one.from(Users).where({ username });

        if (!user) return false;

        // ✅ compare manually
        if (user.password !== password) {
            return false;
        }

        return true;
    });

});