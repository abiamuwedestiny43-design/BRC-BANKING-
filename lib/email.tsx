import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  const mailOptions = {
    from: from || process.env.SMTP_FROM || "noreply@Corporatebank.com",
    to,
    subject,
    html,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent: " + info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error.message }
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateTransferCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export const emailTemplates = {
  welcome: (name: string, accountNumber: string) => ({
    subject: "Welcome to Corporate Bank - Account Created Successfully",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Corporate Bank</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .account-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Corporate Bank</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Congratulations! Your Corporate Bank account has been created successfully.</p>
              
              <div class="account-info">
                <h3>Your Account Details:</h3>
                <p><strong>Account Number:</strong> ${accountNumber}</p>
                <p><strong>Account Type:</strong> Savings Account</p>
                <p><strong>Status:</strong> Pending Verification</p>
              </div>
              
              <p>To complete your account setup and enable transfers, please:</p>
              <ul>
                <li>Log in to your account</li>
                <li>Complete your profile information</li>
                <li>Upload required documents for verification</li>
              </ul>
              
              <p>If you have any questions, our customer support team is here to help 24/7.</p>
              
              <p>Thank you for choosing Corporate Bank!</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  transferOTP: (name: string, otp: string, amount: number, currency: string, recipient: string, bankName: string) => ({
    subject: "Transfer OTP Code - Corporate Bank",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Transfer OTP Code</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .otp-box { background: white; padding: 30px; text-align: center; border-radius: 8px; margin: 20px 0; border: 2px solid #3b82f6; }
            .otp-code { font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 8px; margin: 20px 0; }
            .transfer-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Transfer OTP Code</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>You have initiated a money transfer. Please use the OTP code below to complete your transaction:</p>
              
              <div class="otp-box">
                <p>Your OTP Code:</p>
                <div class="otp-code">${otp}</div>
                <p><small>This code will expire in 10 minutes</small></p>
              </div>
              
              <div class="transfer-details">
                <h3>Transfer Details:</h3>
                <p><strong>Amount:</strong> ${amount.toLocaleString()} ${currency}</p>
                <p><strong>Recipient:</strong> ${recipient}</p>
                <p><strong>Bank:</strong> ${bankName}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div class="warning">
                <p><strong>Security Notice:</strong> Never share this OTP with anyone. Corporate Bank will never ask for your OTP over phone or email.</p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  transactionNotification: (
    name: string,
    type: "credit" | "debit",
    amount: number,
    currency: string,
    accountNumber: string,
    description: string,
    balance: number,
    txRef: string,
  ) => ({
    subject: `Transaction Alert - ${type === "credit" ? "Money Received" : "Money Sent"} - Corporate Bank`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Transaction Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${type === "credit" ? "#059669" : "#dc2626"}; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .transaction-box { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${type === "credit" ? "#059669" : "#dc2626"}; }
            .amount { font-size: 24px; font-weight: bold; color: ${type === "credit" ? "#059669" : "#dc2626"}; }
            .balance-info { background: #e5e7eb; padding: 15px; border-radius: 6px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Transaction Alert</h1>
              <p>${type === "credit" ? "Money Received" : "Money Sent"}</p>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>This is to notify you that an amount of <strong>${amount.toLocaleString()} ${currency}</strong> has been ${type === "credit" ? "credited to" : "debited from"} your account.</p>
              
              <div class="transaction-box">
                <h3>Transaction Details:</h3>
                <p><strong>Amount:</strong> <span class="amount">${type === "credit" ? "+" : "-"}${amount.toLocaleString()} ${currency}</span></p>
                <p><strong>Account:</strong> ${accountNumber.slice(0, 3)}***${accountNumber.slice(-3)}</p>
                <p><strong>Description:</strong> ${description || "No description"}</p>
                <p><strong>Reference:</strong> ${txRef}</p>
                <p><strong>Date & Time:</strong> ${new Date().toLocaleString()}</p>
                
                <div class="balance-info">
                  <p><strong>Available Balance:</strong> ${balance.toLocaleString()} ${currency}</p>
                </div>
              </div>
              
              <p>If you did not authorize this transaction, please contact our customer support immediately.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  accountVerification: (name: string, accountNumber: string) => ({
    subject: "Account Verified Successfully - Corporate Bank",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verified</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .success-box { background: white; padding: 25px; text-align: center; border-radius: 8px; margin: 20px 0; border: 2px solid #059669; }
            .checkmark { font-size: 48px; color: #059669; margin-bottom: 20px; }
            .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Account Verified!</h1>
            </div>
            <div class="content">
              <div class="success-box">
                <div class="checkmark">✓</div>
                <h2>Congratulations ${name}!</h2>
                <p>Your Corporate Bank account has been successfully verified.</p>
                <p><strong>Account Number:</strong> ${accountNumber}</p>
              </div>
              
              <div class="features">
                <h3>You can now enjoy full banking features:</h3>
                <ul>
                  <li>Send and receive money transfers</li>
                  <li>Apply for debit and credit cards</li>
                  <li>Access all banking services</li>
                  <li>Higher transaction limits</li>
                  <li>Priority customer support</li>
                </ul>
              </div>
              
              <p>Thank you for choosing Corporate Bank. We're excited to serve you!</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: "Password Reset Request - Corporate Bank",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .security-notice { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>We received a request to reset your Corporate Bank account password.</p>
              
              <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #3b82f6;">${resetUrl}</p>
              
              <div class="security-notice">
                <p><strong>Security Notice:</strong> If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
              </div>
              
              <p>This link will expire in 1 hour for security reasons.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  profileUpdated: (name: string) => ({
    subject: `Profile Updated - Corporate Bank`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Profile Updated</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px; }
            .security-notice { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Profile Updated</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your Corporate Bank profile information has been successfully updated.</p>
              
              <div class="security-notice">
                <p><strong>Security Notice:</strong> If you did not make these changes, please contact our support team immediately.</p>
              </div>
              
              <p>If you have any questions, our customer support team is here to help.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordChanged: (name: string) => ({
    subject: `Password Changed - Corporate Bank`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px; }
            .security-alert { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Changed</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your Corporate Bank account password has been successfully changed.</p>
              
              <div class="security-alert">
                <h3>Important Security Information:</h3>
                <ul>
                  <li>If you did not make this change, contact support immediately</li>
                  <li>Use a strong, unique password</li>
                  <li>Never share your password with anyone</li>
                  <li>Enable two-factor authentication for added security</li>
                </ul>
              </div>
              
              <p>If you have any questions, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  loanApplication: (
    name: string,
    loanType: string,
    amount: number,
    currency: string
  ) => ({
    subject: `Loan Application Received - Corporate Bank`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Loan Application Received</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px; }
            .loan-preview { background: white; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 4px solid #667eea; }
            .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; background: #f59e0b; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Loan Application Received</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Thank you for applying for an Corporate Bank ${loanType} loan.</p>
              
              <div class="loan-preview">
                <h3>Application Details:</h3>
                <p><strong>Loan Type:</strong> ${loanType.charAt(0).toUpperCase() + loanType.slice(1)
      } Loan</p>
                <p><strong>Amount:</strong> ${amount.toLocaleString()} ${currency}</p>
                <p><strong>Status:</strong> <span class="status-badge">Pending Approval</span></p>
                <p><strong>Applied Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <p>Your application is currently under review. Our team will assess your application and you will receive another email once a decision has been made.</p>
              <p>Typically, this process takes 3-5 business days.</p>
              
              <p>Thank you for choosing Corporate Bank!</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  loanStatusUpdate: (
    name: string,
    loanType: string,
    amount: number,
    currency: string,
    status: string,
    reason?: string
  ) => ({
    subject: `Loan Application ${status.charAt(0).toUpperCase() + status.slice(1)
      } - Corporate Bank`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Loan Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { 
              background: ${status === 'approved'
        ? 'linear-gradient(135deg, #059669, #10b981)'
        : status === 'rejected'
          ? 'linear-gradient(135deg, #dc2626, #ef4444)'
          : 'linear-gradient(135deg, #f59e0b, #fbbf24)'
      }; 
              color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; 
            }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px; }
            .loan-details { background: white; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .status-badge { 
              display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: bold; color: white;
              background: ${status === 'approved'
        ? '#059669'
        : status === 'rejected'
          ? '#dc2626'
          : '#f59e0b'
      };
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Loan Application ${status === 'approved'
        ? 'Approved'
        : status === 'rejected'
          ? 'Rejected'
          : 'Updated'
      }</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your Corporate Bank ${loanType} loan application has been <strong>${status}</strong>.</p>
              
              <div class="loan-details">
                <h3>Loan Details:</h3>
                <p><strong>Loan Type:</strong> ${loanType.charAt(0).toUpperCase() + loanType.slice(1)
      } Loan</p>
                <p><strong>Amount:</strong> ${amount.toLocaleString()} ${currency}</p>
                <p><strong>Status:</strong> <span class="status-badge">${status.charAt(0).toUpperCase() + status.slice(1)
      }</span></p>
                ${status === 'approved'
        ? `
                  <p><strong>Next Steps:</strong> The loan amount will be disbursed to your account within 24-48 hours.</p>
                `
        : ''
      }
                ${status === 'rejected' && reason
        ? `
                  <p><strong>Reason:</strong> ${reason}</p>
                `
        : ''
      }
              </div>
              
              ${status === 'approved'
        ? `
                <p>You can view your loan details and repayment schedule in your Corporate Bank dashboard.</p>
              `
        : status === 'rejected'
          ? `
                <p>If you have any questions about this decision, please contact our customer support team.</p>
              `
          : ''
      }
              
              <p>Thank you for choosing Corporate Bank!</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  cardApplication: (name: string, cardType: string, vendor: string) => ({
    subject: `Card Application Received - Corporate Bank`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Card Application Received</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px; }
            .card-preview { background: white; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 4px solid #667eea; }
            .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; background: #f59e0b; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Card Application Received</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Thank you for applying for an Corporate Bank ${vendor} ${cardType} card.</p>
              
              <div class="card-preview">
                <h3>Application Details:</h3>
                <p><strong>Card Type:</strong> ${cardType.charAt(0).toUpperCase() + cardType.slice(1)
      } Card</p>
                <p><strong>Vendor:</strong> ${vendor.charAt(0).toUpperCase() + vendor.slice(1)
      }</p>
                <p><strong>Status:</strong> <span class="status-badge">Pending Approval</span></p>
                <p><strong>Applied Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <p>Your application is currently under review. You will receive another email once your application has been processed.</p>
              <p>Typically, this process takes 2-3 business days.</p>
              
              <p>Thank you for choosing Corporate Bank!</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  cardStatusUpdate: (
    name: string,
    cardType: string,
    vendor: string,
    status: string,
    cardNumber?: string
  ) => ({
    subject: `Card Application ${status.charAt(0).toUpperCase() + status.slice(1)
      } - Corporate Bank`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Card Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { 
              background: ${status === 'active'
        ? 'linear-gradient(135deg, #059669, #10b981)'
        : status === 'rejected'
          ? 'linear-gradient(135deg, #dc2626, #ef4444)'
          : 'linear-gradient(135deg, #f59e0b, #fbbf24)'
      }; 
              color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; 
            }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px; }
            .card-details { background: white; padding: 25px; border-radius: 15px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .status-badge { 
              display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: bold; color: white;
              background: ${status === 'active'
        ? '#059669'
        : status === 'rejected'
          ? '#dc2626'
          : '#f59e0b'
      };
            }
            .card-number { 
              font-family: monospace; 
              font-size: 18px; 
              letter-spacing: 2px; 
              background: #f3f4f6; 
              padding: 15px; 
              border-radius: 8px; 
              text-align: center;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Card Application ${status === 'active'
        ? 'Approved'
        : status === 'rejected'
          ? 'Rejected'
          : 'Updated'
      }</h1>
            </div>
            <div class="content">
              <h2>Hello ${name},</h2>
              <p>Your Corporate Bank ${vendor} ${cardType} card application has been <strong>${status}</strong>.</p>
              
              <div class="card-details">
                <h3>Card Details:</h3>
                <p><strong>Card Type:</strong> ${cardType.charAt(0).toUpperCase() + cardType.slice(1)
      } Card</p>
                <p><strong>Vendor:</strong> ${vendor.charAt(0).toUpperCase() + vendor.slice(1)
      }</p>
                <p><strong>Status:</strong> <span class="status-badge">${status.charAt(0).toUpperCase() + status.slice(1)
      }</span></p>
                ${status === 'active' && cardNumber
        ? `
                  <p><strong>Card Number:</strong></p>
                  <div class="card-number">${cardNumber.replace(
          /(.{4})/g,
          '$1 '
        )}</div>
                  <p><small><strong>Important:</strong> Your physical card will arrive within 7-10 business days.</small></p>
                `
        : ''
      }
                ${status === 'rejected'
        ? `
                  <p>Unfortunately, your card application has been rejected. This could be due to various reasons including verification issues or eligibility criteria.</p>
                  <p>Please contact our customer support for more information.</p>
                `
        : ''
      }
              </div>
              
              ${status === 'active'
        ? `
                <p>You can now use your virtual card for online transactions. Your physical card is being prepared for delivery.</p>
              `
        : ''
      }
              
              <p>Thank you for choosing Corporate Bank!</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  accountVerifiedByAdmin: (name: string, adminEmail: string, notes?: string) => ({
    subject: "Account Verified by Admin - Corporate Bank",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verified</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .success-box { background: white; padding: 25px; text-align: center; border-radius: 8px; margin: 20px 0; border: 2px solid #059669; }
            .notes { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Account Verified</h1>
            </div>
            <div class="content">
              <div class="success-box">
                <h2>Hello ${name},</h2>
                <p>Your Corporate Bank account has been manually verified by our administration team.</p>
              </div>
              
              ${notes ? `
                <div class="notes">
                  <h3>Admin Notes:</h3>
                  <p>${notes}</p>
                </div>
              ` : ''}
              
              <p>You now have full access to all banking features.</p>
              <p>Verified by: ${adminEmail}</p>
              
              <p>Thank you for choosing Corporate Bank!</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  roleApproved: (name: string, role: string, adminEmail: string) => ({
    subject: "Role Request Approved - Corporate Bank",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Role Approved</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
            .role-box { background: white; padding: 25px; text-align: center; border-radius: 8px; margin: 20px 0; border: 2px solid #3b82f6; }
            .role-name { font-size: 24px; font-weight: bold; color: #3b82f6; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Role Request Approved</h1>
            </div>
            <div class="content">
              <div class="role-box">
                <h2>Hello ${name},</h2>
                <p>Your request for the following role has been approved:</p>
                <div class="role-name">${role.toUpperCase()}</div>
              </div>
              
              <p>You now have the permissions associated with this role.</p>
              <p>Approved by: ${adminEmail}</p>
              
              <p>Thank you for being part of Corporate Bank!</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Corporate Bank. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}

export async function sendWelcomeEmail(to: string, name: string, accountNumber: string) {
  const template = emailTemplates.welcome(name, accountNumber)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendTransferOTP(
  to: string,
  name: string,
  otp: string,
  amount: number,
  currency: string,
  recipient: string,
  bankName: string,
) {
  const template = emailTemplates.transferOTP(name, otp, amount, currency, recipient, bankName)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendTransactionNotification(
  to: string,
  name: string,
  type: "credit" | "debit",
  amount: number,
  currency: string,
  accountNumber: string,
  description: string,
  balance: number,
  txRef: string,
) {
  const template = emailTemplates.transactionNotification(
    name,
    type,
    amount,
    currency,
    accountNumber,
    description,
    balance,
    txRef,
  )
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendAccountVerificationEmail(to: string, name: string, accountNumber: string) {
  const template = emailTemplates.accountVerification(name, accountNumber)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  const template = emailTemplates.passwordReset(name, resetUrl)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendProfileUpdateEmail(to: string, name: string) {
  const template = emailTemplates.profileUpdated(name)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendPasswordChangeEmail(to: string, name: string) {
  const template = emailTemplates.passwordChanged(name)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendLoanApplicationEmail(
  to: string,
  name: string,
  loanType: string,
  amount: number,
  currency: string
) {
  const template = emailTemplates.loanApplication(
    name,
    loanType,
    amount,
    currency
  )
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendLoanStatusUpdateEmail(
  to: string,
  name: string,
  loanType: string,
  amount: number,
  currency: string,
  status: string,
  reason?: string
) {
  const template = emailTemplates.loanStatusUpdate(
    name,
    loanType,
    amount,
    currency,
    status,
    reason
  )
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendCardApplicationEmail(
  to: string,
  name: string,
  cardType: string,
  vendor: string
) {
  const template = emailTemplates.cardApplication(name, cardType, vendor)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendCardStatusUpdateEmail(
  to: string,
  name: string,
  cardType: string,
  vendor: string,
  status: string,
  cardNumber?: string
) {
  const template = emailTemplates.cardStatusUpdate(
    name,
    cardType,
    vendor,
    status,
    cardNumber
  )
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendAccountVerifiedByAdminEmail(
  to: string,
  name: string,
  adminEmail: string,
  notes?: string
) {
  const template = emailTemplates.accountVerifiedByAdmin(name, adminEmail, notes)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendRoleApprovedEmail(
  to: string,
  name: string,
  role: string,
  adminEmail: string
) {
  const template = emailTemplates.roleApproved(name, role, adminEmail)
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}
