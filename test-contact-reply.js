// Using built-in fetch (Node.js 18+)

async function testContactReply() {
  try {
    // First, let's get a valid admin token by logging in
    console.log('Testing admin login...');
    const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('Login failed. Trying with existing admin credentials...');
      // Try with different credentials or get existing token
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    
    console.log('Admin login successful, token:', token.substring(0, 20) + '...');

    // Get contacts to find a valid contact ID
    const contactsResponse = await fetch('http://localhost:5001/api/admin/contacts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!contactsResponse.ok) {
      console.log('Failed to get contacts');
      return;
    }

    const contactsData = await contactsResponse.json();
    console.log('Contacts found:', contactsData.count);

    if (contactsData.count === 0) {
      console.log('No contacts found to test with');
      return;
    }

    const contactId = contactsData.data[0]._id;
    console.log('Testing reply with contact ID:', contactId);

    // Test the reply functionality
    const replyResponse = await fetch(`http://localhost:5001/api/admin/contact-reply/${contactId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        replyMessage: 'This is a test reply from the admin.'
      })
    });

    const replyData = await replyResponse.json();
    
    console.log('Reply Response Status:', replyResponse.status);
    console.log('Reply Response Data:', JSON.stringify(replyData, null, 2));

    if (replyResponse.ok && replyData.success) {
      console.log('✅ SUCCESS: Contact reply functionality is working!');
      console.log('Email status:', replyData.emailSent ? 'Sent' : 'Failed (as expected without proper config)');
    } else {
      console.log('❌ FAILED: Contact reply functionality has issues');
    }

  } catch (error) {
    console.error('Test failed with error:', error.message);
  }
}

testContactReply();
