const nodemailer = require("nodemailer");
const twilio = require("twilio");

class NotificationService {
  constructor() {
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }
  }

  async sendSMS(phoneNumber, accessCode) {
    try {
      if (!this.twilioClient) {
        throw new Error("Twilio client not initialized. Please check your credentials.");
      }

      const message = await this.twilioClient.messages.create({
        body: `Your Employee Task Management access code is: ${accessCode}. This code will expire in 10 minutes.`,
        from: process.env.TWILIO_FROM_NUMBER,
        to: phoneNumber,
      });

      return {
        success: true,
        message: "SMS sent successfully",
        response: { sid: message.sid, status: message.status },
      };
    } catch (error) {
      console.error("SMS sending error:", error);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  async sendEmail(email, accessCode) {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return { success: true, message: "Email sent successfully" };
      }

      const mailOptions = {
        from: {
          name: process.env.EMAIL_FROM_NAME || "Employee Task Management",
          address: process.env.EMAIL_USER,
        },
        to: email,
        subject: "Your Access Code - Employee Task Management",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Employee Task Management</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Hello,
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                You have requested access to Employee Task Management. Please use the following access code:
              </p>
              
              <div style="background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                <h1 style="color: #495057; font-size: 36px; margin: 0; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                  ${accessCode}
                </h1>
              </div>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                This code will expire in <strong>10 minutes</strong> for security purposes.
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                If you didn't request this code, please ignore this email.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
              
              <p style="color: #999; font-size: 14px; text-align: center;">
                Employee Task Management System<br>
                This is an automated message, please do not reply.
              </p>
            </div>
          </div>
        `,
        text: `Your Employee Task Management access code is: ${accessCode}. This code will expire in 10 minutes.`,
      };

      const info = await this.emailTransporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);
      return {
        success: true,
        message: "Email sent successfully",
        messageId: info.messageId,
      };
    } catch (error) {
      throw new Error("Failed to send email");
    }
  }

  async verifyEmailConfig() {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return { success: false, message: "Email configuration missing" };
      }
      await this.emailTransporter.verify();
      return { success: true, message: "Email configuration verified" };
    } catch (error) {
      return {
        success: false,
        message: "Email configuration invalid",
        error: error.message,
      };
    }
  }
}

module.exports = new NotificationService();
