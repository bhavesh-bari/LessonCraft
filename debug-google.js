// This script helps debug Google API permissions.
require('dotenv').config({ path: '.env.local' }); // Load variables from .env.local
const { google } = require('googleapis');

async function testGoogleDocs() {
    console.log('Authenticating with Google...');

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/documents'],
    });

    const docs = google.docs({ version: 'v1', auth });

    try {
        console.log('Attempting to create a Google Doc...');
        const doc = await docs.documents.create({
            requestBody: {
                title: 'My Debug Test Document',
            },
        });
        console.log('✅ Success! Document created with ID:', doc.data.documentId);
        console.log('This means your Google credentials and API settings are correct.');

    } catch (error) {
        console.error('❌ Failed to create document. This confirms a permission issue.');
        console.error('Error Details:', error.message);
    }
}

testGoogleDocs();