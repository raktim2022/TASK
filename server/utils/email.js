const nodemailer = require('nodemailer');

exports.sendInquiryEmail = async (inquiryData) => {
  try {
    const { name, email, phone, message, subject } = inquiryData;
    
    const recipientEmail = process.env.INQUIRY_EMAIL || 'your-inquiry-email@example.com';
    
    console.log(`Preparing to send email to ${email}`);
    console.log(process.env.EMAIL_USER);
    
    const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
    
    const mailOptions = {
      from: `"Inquiry Form" <${process.env.EMAIL_FROM || 'noreply@yourdomain.com'}>`,
      to: email,
      subject: subject || 'New Inquiry from Website',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #333;">New Inquiry</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">
            This inquiry was sent from your website contact form.
          </p>
        </div>
      `,
      text: `
        New Inquiry
        
        From: ${name}
        Email: ${email}
        ${phone ? `Phone: ${phone}` : ''}
        
        Message:
        ${message}
        
        This inquiry was sent from your website contact form.
      `
    };
    
      try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    
    if (process.env.NODE_ENV === 'development') {
      return { 
        messageId: 'dev-mode-no-email-sent',
        preview: 'Email not sent in development mode'
      };
    }
 }
    return info;
  } catch (error) {
    console.error('Error sending inquiry email:', error);
    throw error;
  }
};