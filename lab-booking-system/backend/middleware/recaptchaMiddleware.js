const axios = require('axios');

const verifyRecaptcha = async (req, res, next) => {
  try {
    const { recaptchaToken } = req.body;
    const role = req.body.role;
    
    // TEMPORARY BYPASS: Skip reCAPTCHA for all user logins to debug authentication
    if (role === 'user') {
      console.log('🔧 DEBUG: Temporarily bypassing reCAPTCHA for user login to debug authentication');
      return next();
    }
    
    // For admin and lab technician roles, require reCAPTCHA in production, but allow bypass in development
    if ((role === 'admin' || role === 'labtechnician')) {
      if (!recaptchaToken && process.env.NODE_ENV === 'production') {
        console.log('❌ reCAPTCHA token missing for admin/lab technician login in production');
        return res.status(400).json({ 
          success: false, 
          message: 'reCAPTCHA verification is required for admin login' 
        });
      }
      if (!recaptchaToken && process.env.NODE_ENV !== 'production') {
        console.log('⏭️  DEVELOPMENT MODE: Bypassing reCAPTCHA verification for admin/lab technician login');
        return next();
      }
    }
    
    // DEVELOPMENT BYPASS: Skip reCAPTCHA verification for non-admin users in development
    if (process.env.NODE_ENV !== 'production' && role !== 'admin' && role !== 'labtechnician') {
      console.log('⏭️  DEVELOPMENT MODE: Bypassing reCAPTCHA verification for non-admin users');
      return next();
    }
    
    // Skip reCAPTCHA verification if token is missing for other roles
    if (!recaptchaToken && role !== 'admin' && role !== 'labtechnician') {
      console.log('⏭️  reCAPTCHA token missing, proceeding anyway for other roles');
      return next();
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secretKey) {
      console.error('❌ RECAPTCHA_SECRET_KEY not configured in environment variables');
      return res.status(500).json({ 
        success: false, 
        message: 'reCAPTCHA service misconfigured' 
      });
    }
    
    // Verify with Google
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    
    console.log('🔍 Verifying reCAPTCHA token with Google API...');
    const response = await axios.post(verificationURL);
    const { success, score, challenge_ts, hostname, error_codes } = response.data;
    
    console.log('📊 reCAPTCHA verification response:', {
      success,
      score,
      hostname,
      error_codes,
      role
    });
    
    if (!success) {  
      console.log('❌ reCAPTCHA verification failed:', error_codes?.join(', '));
      return res.status(400).json({ 
        success: false, 
        message: `reCAPTCHA verification failed. ${error_codes?.length > 0 ? 'Errors: ' + error_codes.join(', ') : 'Please try again.'}`
      });
    }
    
    console.log('✅ reCAPTCHA verification successful');
    next();
  } catch (error) {
    console.error('❌ reCAPTCHA verification error:', error.message);
    // Always fail on reCAPTCHA errors for admin and lab technicians, regardless of environment
    if (req.body.role === 'admin' || req.body.role === 'labtechnician') {
      return res.status(500).json({ 
        success: false, 
        message: 'reCAPTCHA service unavailable. Admin login requires reCAPTCHA verification.' 
      });
    }
    // Allow other users to proceed in development
    if (process.env.NODE_ENV !== 'development') {
      return res.status(500).json({ 
        success: false, 
        message: 'reCAPTCHA service unavailable. Please try again later.' 
      });
    }
    // Allow other users to proceed in development
    return next();
  }
};

module.exports = { verifyRecaptcha };
