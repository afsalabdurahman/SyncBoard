import { ca } from "zod/v4/locales";
import { IEmailService } from "../../domain/interfaces/services/IEmailServices";
import { Resend } from 'resend';
export class ResendMailService implements IEmailService {
     private resend: Resend = new Resend(process.env.RESEND_API_KEY || '');
     
  async sendOtp(email: string, otp: string): Promise<void> {
   
try {
  await this.resend.emails.send({
  from: 'onboarding@resend.dev',
  to: email,
  subject: "🔐 Your OTP Code",
  text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  html:  `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6; color: #333;">
            <div style="max-width: 500px; margin: auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <h2 style="color: #4A90E2;">🔐 Your One-Time Password</h2>
              <p>Hello,</p>
              <p>Use the following OTP to complete your action. This code is valid for <strong>10 minutes</strong>:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; padding: 15px 25px; font-size: 24px; letter-spacing: 2px; background-color: #f0f4ff; color: #4A90E2; border-radius: 6px; font-weight: bold;">
                  ${otp}
                </span>
              </div>
              <p>If you did not request this, you can ignore this email.</p>
              <p style="margin-top: 40px;">Thanks,<br/><strong>GrideSync</strong></p>
            </div>
          </div>
        `,
});
}catch (error) {
  console.error("Error sending OTP email:", error);
  throw new Error("Failed to send OTP email."); }



}
  async inviteMembers(email: string, invitationLink: string, token: number): Promise<void> {
    
    await this.resend.emails.send({
  from: 'onboarding@resend.dev',
  to: email,
   subject: "🔐 Your Invite link",
   text: `${invitationLink}. It is valid for 5 hours.`,
     html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6; color: #333;">
  <div style="max-width: 500px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 6px 18px rgba(0,0,0,0.1);">
    <h2 style="color: #4A90E2; text-align: center;">🔐 Your Workspace Join Link</h2>
    <p style="font-size: 16px;">Hello,</p>
    <p style="font-size: 16px;">
      Use the following link to join your workspace. This link is valid for <strong>5 hours</strong>:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href=${invitationLink}/${token}
         style="display: inline-block; padding: 15px 30px; font-size: 18px; letter-spacing: 1px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        👉 Join Workspace
      </a>
    </div>
    <p style="font-size: 14px; color: #777;">If you did not request this, you can safely ignore this email.</p>
    <p style="margin-top: 40px; font-size: 16px;">Thanks,<br/><strong>GrideSync Team</strong></p>
  </div>
</div>

      `,
});
}

  async sendAbuseStatus(email: string, message: string | boolean, status: string, name: string): Promise<void> {
   await this.resend.emails.send({
  from: 'onboarding@resend.dev',
  to: email,
 subject: `Report ${status} Status updation`,
  text: `Hello ${name},\n\nWe have received a report regarding your account. Here are the details:\n\nMessage: ${message}\nStatus: ${status}\n\nIf you have any questions, please contact our support team.`,
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6; color: #333;">
      <div style="max-width: 500px; margin: auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="color: #4A90E2;">🔐 Abuse Report</h2>
        <p>Hello ${name},</p>
        <p>We have received a report regarding your account. Here are the details:</p>
        <ul>
          <li><strong>Message:</strong> ${message}</li>
          <li><strong>Status:</strong> ${status}</li>
        </ul>
        <p>If you have any questions, please contact our support team.</p>
        <p style="margin-top: 40px;">Thanks,<br/><strong>GrideSync Team</strong></p>
      </div>
    </div>
  `
});
}
  async sendReceipts(name: string, email: string, receiptLink: string): Promise<void> {
   await this.resend.emails.send({
  from: 'onboarding@resend.dev',
  to: email,
  subject: "🔐 Your Receipt",
  text: `Hello ${name},\n\nPlease find your receipt attached.`,
   html: `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #222;">Hello ${name},</h2>

      <p>
        Thank you for upgrading your plan with <strong>GrideSync</strong>.
        We truly appreciate your trust and are excited to provide you with enhanced features and benefits.
      </p>

      <p>
        Your upgrade has been successfully completed. You can download your payment receipt using the link below:
      </p>

      <p style="margin: 20px 0;">
        <a 
          href="${receiptLink}" 
          style="
            display: inline-block;
            padding: 10px 16px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
          "
        >
          Download Receipt
        </a>
      </p>

      <p>
        If you have any questions or need assistance, feel free to reach out to our support team.
      </p>

      <p style="margin-top: 30px;">
        Best regards,<br />
        <strong>GrideSync Team</strong>
      </p>

      <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e7eb;" />

      <p style="font-size: 12px; color: #6b7280;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  `,
});
}
}