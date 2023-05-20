# LevelDB Database Decryptor

A simple Node.js command-line application to recover and decrypt an encrypted LevelDB (LDB) database. This tool uses the `crypto` module to decrypt the data and custom LDB parser and key derivation libraries to handle LevelDB operations and key derivation.

## Prerequisites

- Node.js (v14 or newer)
- NPM

## Installation

Install the package globally

```bash
npm install -g @leanmull/leveldb-decryptor@latest
```

## Usage

Run the decryption script with the appropriate command-line arguments:

```bash
npx leveldb-decryptor "/path/to/ldb/file.ldb" your-password "/path/to/decrypted/ldb/file.json"
```

Replace `/path/to/ldb/file.ldb` with the correct path to your LDB file, `/path/to/decrypted/ldb/file.json` with the desired output path, and `your-password` with the actual password for your LDB file.

## Libraries

The application uses the following custom libraries:

- `ldb-parser`: A simple LevelDB parser library for interacting with LevelDB databases.
- `key-derivation`: A library for deriving a key from a password using the PBKDF2 algorithm.

## Author

Leandro Müller - Feel free to reach out if you have any questions, suggestions, or need assistance.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is provided "as is" without warranty of any kind, either expressed or implied. Use it at your own risk. Always ensure you have proper backups of your data before attempting any decryption or recovery process.