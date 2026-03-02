// Simple test to check if the API endpoint exists and handles requests correctly
async function testEndpoint() {
  try {
    console.log('Testing contact-reply endpoint without authentication...');
    
    // Test with a fake contact ID to see the error handling
    const response = await fetch('http://localhost:5001/api/admin/contact-reply/fake123', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        replyMessage: 'Test message'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.status === 401) {
      console.log('✅ GOOD: Endpoint is protected and requires authentication');
    } else if (response.status === 500) {
      console.log('❌ BAD: Server error - this is the issue we need to fix');
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testEndpoint();
