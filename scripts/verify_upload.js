const fs = require('fs');
const path = require('path');

async function verifyUpload() {
  const baseUrl = 'http://localhost:3000';
  const testFilePath = path.join(__dirname, 'test-file.txt');
  const testContent = 'This is a test file for MongoDB GridFS upload verification.';

  // Create a dummy file
  fs.writeFileSync(testFilePath, testContent);
  console.log('Created test file:', testFilePath);

  try {
    // 1. Upload the file
    console.log('Uploading file...');
    const formData = new FormData();
    const fileBlob = new Blob([testContent], { type: 'text/plain' });
    formData.append('file', fileBlob, 'test-file.txt');

    const uploadRes = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed with status ${uploadRes.status}: ${await uploadRes.text()}`);
    }

    const uploadData = await uploadRes.json();
    console.log('Upload successful. Response:', uploadData);

    const fileUrl = uploadData.fileUrl;
    if (!fileUrl) {
      throw new Error('No fileUrl returned in response');
    }

    // 2. Retrieve the file
    console.log(`Retrieving file from ${baseUrl}${fileUrl}...`);
    const downloadRes = await fetch(`${baseUrl}${fileUrl}`);

    if (!downloadRes.ok) {
      throw new Error(`Download failed with status ${downloadRes.status}`);
    }

    const downloadedContent = await downloadRes.text();
    console.log('Downloaded content:', downloadedContent);

    // 3. Verify content
    if (downloadedContent === testContent) {
      console.log('SUCCESS: Downloaded content matches uploaded content!');
    } else {
      console.error('FAILURE: Content mismatch!');
      console.error('Expected:', testContent);
      console.error('Received:', downloadedContent);
    }

  } catch (error) {
    console.error('Verification failed:', error.message);
    if (error.cause) console.error('Cause:', error.cause);
  } finally {
    // Cleanup
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log('Cleaned up test file.');
    }
  }
}

verifyUpload();
