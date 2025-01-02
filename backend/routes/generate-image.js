const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Route to generate a molecule image
router.post('/generate-molecule-image', async (req, res) => {
    try {
        const { smiles } = req.body; // Expect a single SMILES string from the frontend

        // Validate input
        if (!smiles || typeof smiles !== 'string') {
            return res.status(400).json({ error: 'Invalid SMILES string provided.' });
        }

        const outputDir = path.join(__dirname, '../temp/molecule_images');
        fs.mkdirSync(outputDir, { recursive: true }); // Ensure the output directory exists

        // Path to the Python script
        const pythonScriptPath = path.join(__dirname, '../scripts/generate_molecule_images.py');

        // Spawn the Python script process
        const pythonProcess = spawn('python', [pythonScriptPath, outputDir, smiles]);

        let scriptOutput = '';
        let scriptError = '';

        // Capture Python script output and errors
        pythonProcess.stdout.on('data', (data) => {
            scriptOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            scriptError += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script error: ${scriptError}`);
                return res.status(500).json({ error: 'Error executing Python script.', details: scriptError });
            }

            // Check for generated files
            fs.readdir(outputDir, (err, files) => {
                if (err) {
                    console.error(`Error reading output directory: ${err.message}`);
                    return res.status(500).json({ error: 'Error reading generated file.' });
                }

                if (files.length === 0) {
                    console.error('No image generated.');
                    return res.status(500).json({ error: 'No image generated.' });
                }

                // Read the first generated image (assuming one image per request)
                const filePath = path.join(outputDir, files[0]);
                try {
                    const fileData = fs.readFileSync(filePath, { encoding: 'base64' });

                    // Optionally delete the file after serving
                    fs.unlinkSync(filePath);

                    res.json({
                        success: true,
                        message: 'Molecule image generated successfully.',
                        fileName: files[0],
                        fileData: `data:image/png;base64,${fileData}`,
                    });
                } catch (readError) {
                    console.error(`Error reading the file: ${readError.message}`);
                    return res.status(500).json({ error: 'Error processing generated image file.' });
                }
            });
        });
    } catch (error) {
        console.error(`Unexpected error: ${error.message}`);
        res.status(500).json({ error: 'An unexpected error occurred.', details: error.message });
    }
});

module.exports = router;
