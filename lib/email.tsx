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

const brandStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
  body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #cbd5e1; background-color: #001c10; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
  .container { max-width: 600px; margin: 40px auto; background: #002a18; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
  .header { padding: 40px; text-align: center; background: linear-gradient(to bottom, #003d24, #002a18); border-bottom: 1px solid rgba(255,255,255,0.05); }
  .logo { font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -1px; text-transform: lowercase; font-style: italic; text-decoration: none; }
  .logo span { color: #10b981; }
  .content { padding: 40px; }
  h1 { font-size: 28px; font-weight: 900; color: #ffffff; margin: 0 0 10px; letter-spacing: -1px; line-height: 1.2; }
  p { margin: 0 0 20px; color: #94a3b8; font-size: 15px; }
  .info-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; margin: 24px 0; }
  .info-label { color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .info-value { color: #ffffff; font-weight: 700; font-size: 14px; }
  .button { display: inline-block; padding: 16px 32px; background: #10b981; color: #001c10 !important; text-decoration: none; border-radius: 12px; font-weight: 900; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; }
  .footer { padding: 30px 40px; text-align: center; color: #475569; font-size: 11px; border-top: 1px solid rgba(255,255,255,0.05); }
  .otp-code { font-size: 40px; font-weight: 900; color: #10b981; letter-spacing: 10px; margin: 20px 0; font-family: monospace; text-align: center; background: rgba(16, 185, 129, 0.05); padding: 20px; border-radius: 12px; border: 1px dashed rgba(16, 185, 129, 0.3); }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
  .badge-success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
  .badge-danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
  .amount { font-size: 32px; font-weight: 900; color: #ffffff; margin: 12px 0; }
  .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 20px 0; }
`

export const emailTemplates = {
  welcome: (name: string, accountNumber: string) => ({
    subject: "Welcome to NOVA - Identity Initialized",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge badge-success">Protocol Initialized</div>
              <h1>Welcome to the Ecosystem</h1>
              <p>Hello ${name}, your global banking identity has been established. You now have access to our secure liquidity network.</p>
              
              <div class="info-box">
                <div class="info-label">Account Identification</div>
                <div class="info-value" style="font-size: 24px; margin-top: 8px;">${accountNumber}</div>
                <div class="divider"></div>
                <div style="display: flex; justify-content: space-between;">
                  <div>
                    <div class="info-label">Status</div>
                    <div class="info-value">Provisioned</div>
                  </div>
                  <div style="text-align: right;">
                    <div class="info-label">Network</div>
                    <div class="info-value">Mainnet v4.0</div>
                  </div>
                </div>
              </div>
              
              <p>To finalize your node synchronization and enable global transfers, please complete your identity verification in the dashboard.</p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Access Terminal</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
              <p>Secure Transmission Protocol ID: ${Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  transferOTP: (name: string, otp: string, amount: number, currency: string, recipient: string, bankName: string) => ({
    subject: "Critical: Transaction Authorization Required",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge badge-danger">High Priority Authorization</div>
              <h1>Authorize Transmission</h1>
              <p>Verification protocol required for an outgoing liquidity transfer of ${amount.toLocaleString()} ${currency}.</p>
              
              <div class="otp-code">${otp}</div>
              
              <div class="info-box">
                <div class="info-label">Target Recipient</div>
                <div class="info-value">${recipient}</div>
                <div class="divider"></div>
                <div class="info-label">Destination Node</div>
                <div class="info-value">${bankName}</div>
                <div class="divider"></div>
                <div class="info-label">Timestamp</div>
                <div class="info-value">${new Date().toLocaleString()}</div>
              </div>
              
              <p style="font-size: 12px; color: #64748b;">Security Notice: If you did not initiate this transmission, immediately disable your node and contact core security.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
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
    subject: `Network Alert: ${type === "credit" ? "Ingress" : "Egress"} Observed`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge ${type === "credit" ? "badge-success" : "badge-danger"}">
                ${type === "credit" ? "Node Ingress" : "Node Egress"} Verified
              </div>
              <h1>Transaction ${type === "credit" ? "Received" : "Sent"}</h1>
              <p>A fiscal state change has been recorded on your primary account.</p>
              
              <div class="amount" style="color: ${type === "credit" ? "#10b981" : "#ffffff"}">
                ${type === "credit" ? "+" : "-"}${amount.toLocaleString()} ${currency}
              </div>
              
              <div class="info-box">
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                   <div>
                      <div class="info-label">Reference ID</div>
                      <div class="info-value">${txRef}</div>
                   </div>
                   <div style="text-align: right;">
                      <div class="info-label">Identifier</div>
                      <div class="info-value">...${accountNumber.slice(-4)}</div>
                   </div>
                </div>
                <div class="divider"></div>
                <div class="info-label">Description</div>
                <div class="info-value">${description || "System initiated protocol"}</div>
                <div class="divider"></div>
                <div class="info-label">New Account Flux</div>
                <div class="info-value" style="color: #ffffff;">${balance.toLocaleString()} ${currency}</div>
              </div>
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  accountVerification: (name: string, accountNumber: string) => ({
    subject: "Core Protocol: Identity Fully Verified",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge badge-success">Verification Complete</div>
              <h1>Clearance Granted</h1>
              <p>Hello ${name}, your identity parameters have been verified. Full network permissions are now active.</p>
              
              <div class="info-box">
                <div class="info-label">Permission Level</div>
                <div class="info-value">Unlimited / Level 2 Secure</div>
                <div class="divider"></div>
                <div class="info-label">Capabilities</div>
                <div class="info-value">Global Transfers, Card Issuance, Credit Lines</div>
              </div>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Access Mainnet</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: "Security: Recovery Protocol Initiated",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge badge-danger">Security Recovery</div>
              <h1>Reset Credentials</h1>
              <p>A credential reset protocol was requested for your identity node.</p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" class="button">Re-authenticate</a>
              </div>
              
              <p style="font-size: 12px; color: #64748b;">This link will expire in 60 minutes. If you did not request this, please ignore this transmission.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  profileUpdated: (name: string) => ({
    subject: "System Alert: Identity Node Updated",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge badge-success">Meta-data Update</div>
              <h1>Node Synchronization</h1>
              <p>Hello ${name}, your core identity parameters have been synchronized across all network clusters.</p>
              
              <div class="info-box">
                <div class="info-label">Last Activity</div>
                <div class="info-value">Profile Metadata Updated</div>
                <div class="divider"></div>
                <div class="info-label">Status</div>
                <div class="info-value">Fully Synchronized</div>
              </div>
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordChanged: (name: string) => ({
    subject: "Critical: Credential Change Confirmed",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge badge-danger">Security Synchronized</div>
              <h1>Credentials Updated</h1>
              <p>Your authentication key for NOVA CORE has been successfully changed.</p>
              
              <div class="info-box">
                <div class="info-label">Change Status</div>
                <div class="info-value">Authorization Success</div>
                <div class="divider"></div>
                <div class="info-label">Action Taken</div>
                <div class="info-value">Main Password Rotated</div>
              </div>
              
              <p style="font-size: 12px; color: #64748b;">If you did not authorize this change, immediately terminate all active sessions and contact security.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
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
    subject: "Protocol Alert: Credit Application Received",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge badge-success">Application Logged</div>
              <h1>Liquidity Provisioning Request</h1>
              <p>Hello ${name}, your application for a ${loanType} credit facility has been received and added to the processing queue.</p>
              
              <div class="info-box">
                <div class="info-label">Facility Type</div>
                <div class="info-value">${loanType.toUpperCase()} RESOURCE</div>
                <div class="divider"></div>
                <div class="info-label">Requested Flux</div>
                <div class="info-value">${amount.toLocaleString()} ${currency}</div>
                <div class="divider"></div>
                <div class="info-label">Status</div>
                <div class="info-value">Under Vetting</div>
              </div>
              
              <p>The evaluation protocol typically completes within 72-96 hours. You will receive a synchronization alert once the decision is finalized.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
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
    subject: `Protocol Update: Credit Facility ${status.toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge ${status === 'approved' ? 'badge-success' : 'badge-danger'}">
                Decision Finalized: ${status.toUpperCase()}
              </div>
              <h1>Facility Synchronization</h1>
              <p>Hello ${name}, the vetting protocol for your ${loanType} credit request has concluded.</p>
              
              <div class="info-box">
                <div class="info-label">Resource ID</div>
                <div class="info-value">${loanType.toUpperCase()} PROVISION</div>
                <div class="divider"></div>
                <div class="info-label">Amount</div>
                <div class="info-value">${amount.toLocaleString()} ${currency}</div>
                <div class="divider"></div>
                ${status === 'approved'
        ? `<div class="info-label">Next Phase</div><div class="info-value">Disbursement within 24h</div>`
        : `<div class="info-label">Reason</div><div class="info-value">${reason || 'Criteria mismatch'}</div>`}
              </div>
              
              ${status === 'approved'
        ? `<p>The liquidity will be injected into your primary node shortly. You can track repayment protocols in your dashboard.</p>`
        : `<p>If you require clarification on this protocol decision, contact core support.</p>`}
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  cardApplication: (name: string, cardType: string, vendor: string) => ({
    subject: "System Alert: Asset Retrieval Protocol Initiated",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge badge-success">Asset Requested</div>
              <h1>Hardware Interface Request</h1>
              <p>Hello ${name}, your request for a ${vendor} ${cardType} physical interface has been logged.</p>
              
              <div class="info-box">
                <div class="info-label">Asset Type</div>
                <div class="info-value">${cardType.toUpperCase()} INTERFACE</div>
                <div class="divider"></div>
                <div class="info-label">Network Provider</div>
                <div class="info-value">${vendor.toUpperCase()}</div>
                <div class="divider"></div>
                <div class="info-label">Status</div>
                <div class="info-value">Identity Vetting</div>
              </div>
              
              <p>Once approved, your physical asset will be dispatched via secure transport. Virtual credentials will be active immediately upon approval.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
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
    subject: `System Alert: Asset Protocol ${status.toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge ${status === 'active' ? 'badge-success' : 'badge-danger'}">
                Protocol State: ${status.toUpperCase()}
              </div>
              <h1>Asset Activation</h1>
              <p>Hello ${name}, the status of your ${vendor} ${cardType} interface has been updated.</p>
              
              <div class="info-box">
                <div class="info-label">Asset Specification</div>
                <div class="info-value">${cardType.toUpperCase()} - ${vendor.toUpperCase()}</div>
                <div class="divider"></div>
                ${status === 'active' && cardNumber
        ? `
                    <div class="info-label">Virtual Credentials</div>
                    <div class="info-value" style="letter-spacing: 2px; font-family: monospace;">${cardNumber.replace(/(.{4})/g, '$1 ')}</div>
                    <div class="divider"></div>
                    <div class="info-label">Physical Logistics</div>
                    <div class="info-value">Dispatching via Secure Node</div>
                    `
        : `
                    <div class="info-label">Final Decision</div>
                    <div class="info-value">Provisioning Terminated</div>
                    `
      }
              </div>
              
              ${status === 'active'
        ? `<p>Virtual liquidity is now active for this asset. Secure transport for the physical interface will arrive within 7-10 cycles.</p>`
        : `<p>Identity or credit vetting parameters were not met for this specific asset request.</p>`}
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  accountVerifiedByAdmin: (name: string, adminEmail: string, notes?: string) => ({
    subject: "Core Permission: Manual Override Verified",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge badge-success">Manual Clearance</div>
              <h1>Identity Absolute</h1>
              <p>Hello ${name}, your identity node has been manually verified by a senior administrator.</p>
              
              <div class="info-box">
                <div class="info-label">Authorized By</div>
                <div class="info-value">${adminEmail}</div>
                ${notes ? `
                  <div class="divider"></div>
                  <div class="info-label">Admin Annotations</div>
                  <div class="info-value">${notes}</div>
                ` : ''}
              </div>
              
              <p>Total network access is now synchronized. All restrictions have been purged.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  roleApproved: (name: string, role: string, adminEmail: string) => ({
    subject: "Permission Alert: Elevated Privileges Granted",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${brandStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">nova<span>core</span></div>
            </div>
            <div class="content">
              <div class="badge badge-success">Elevated Access</div>
              <h1>System Permissions Updated</h1>
              <p>Hello ${name}, your request for elevated network privileges has been authorized.</p>
              
              <div class="info-box">
                <div class="info-label">Assigned Role</div>
                <div class="info-value" style="color: #10b981;">NETWORK ${role.toUpperCase()}</div>
                <div class="divider"></div>
                <div class="info-label">Authorizing Entity</div>
                <div class="info-value">${adminEmail}</div>
              </div>
              
              <p>New terminal capabilities should be visible upon your next synchronization session.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 NOVA CORE SYSTEMS. All rights reserved.</p>
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
