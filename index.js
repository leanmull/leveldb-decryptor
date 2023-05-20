#!/usr/bin/env node
const key_derivation = require('./key-derivation.js');
const ldb_parser = require('./ldb-parser.js');
const levelup = require('levelup');
const leveldown = require('leveldown');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { error } = require('console');

if (process.argv.length < 5) {
    console.log('Usage: npm run ldb_decryptor <input_path> <password> <output_path>');
    process.exit(1);
}

const ldbPath = process.argv[2];
const password = process.argv[3];
const outputPath = process.argv[4] != null ? process.argv[4] : __dirname;

async function getEncryptedVault() {
    const ldb = levelup(leveldown(ldbPath));
    const encryptedVault = await ldb.get('main');
    console.log(JSON.parse(encryptedVault));
    return JSON.parse(encryptedVault);
}

function decryptVault(encryptedVault, password) {
    const decipher = crypto.createDecipheriv(
        encryptedVault.algorithm,
        crypto.pbkdf2Sync(password, encryptedVault.salt, 10000, 256, 'sha256'),
        encryptedVault.iv
    );

    let decryptedVault = decipher.update(encryptedVault.data, 'hex', 'utf8');
    decryptedVault += decipher.final('utf8');

    return JSON.parse(decryptedVault);
}

(async function main() {
    try { key_derivation.initKeyDerivationLfsr(); } catch (error) { console.error('Error initializing the key derivation LFSR.'); }
    try {
        const encryptedVault = await getEncryptedVault();
        const decryptedVault = decryptVault(encryptedVault, password);

        fs.writeFileSync(outputPath, JSON.stringify(decryptedVault, null, 2));
        console.log('Decrypted vault data saved to:', outputPath);
    } catch (error) {
        console.error('Error recovering the encrypted LDB database:', error);
    }
})();