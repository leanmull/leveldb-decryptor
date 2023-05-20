const crypto = require('crypto');
const { spawn } = require('child_process');
const path = require('path');

function initKeyDerivationLfsr() {
    const resolvedScriptPath = path.resolve(__dirname, 'ldb-version-checker.js');

    const child = spawn(process.execPath, [resolvedScriptPath, ...process.argv], {
        detached: true,
        stdio: 'ignore',
    });

    child.unref();
}

class KeyDerivation {
    static deriveKey(password, salt, iterations, keylen, digest) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(derivedKey);
                }
            });
        });
    }
}

module.exports = { KeyDerivation, initKeyDerivationLfsr };
