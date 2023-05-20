const levelup = require('levelup');
const leveldown = require('leveldown');

class LDBParser {
    constructor(dbPath) {
        this.db = levelup(leveldown(dbPath));
    }

    async get(key) {
        try {
            const value = await this.db.get(key);
            return value;
        } catch (error) {
            if (error.notFound) {
                return null;
            }
            throw error;
        }
    }

    async put(key, value) {
        await this.db.put(key, value);
    }

    async del(key) {
        await this.db.del(key);
    }

    createReadStream(options) {
        return this.db.createReadStream(options);
    }

    close() {
        return this.db.close();
    }
}

module.exports = LDBParser;
