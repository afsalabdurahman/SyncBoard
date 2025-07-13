import { injectable, inject } from "tsyringe";
import { IEmailService } from "../../domain/interfaces/services/IEmailServices";
import { EmailConfig } from "../config/EmailConfig";
import { Transporter } from "nodemailer";

@injectable()
export class NodemailerService implements IEmailService {
  private transporter: Transporter;

  constructor(@inject(EmailConfig) emailConfig: EmailConfig) {
    this.transporter = emailConfig.createTransporter();
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
  async inviteMembers(email: string, invitaionLink: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: email,
      subject: "🔐 Your Invite link",
      text: `${invitaionLink}. It is valid for 5 hours.`, // fallback
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6; color: #333;">
  <div style="max-width: 500px; margin: auto; background-color: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 6px 18px rgba(0,0,0,0.1);">
    <h2 style="color: #4A90E2; text-align: center;">🔐 Your Workspace Join Link</h2>
    <p style="font-size: 16px;">Hello,</p>
    <p style="font-size: 16px;">
      Use the following link to join your workspace. This link is valid for <strong>5 hours</strong>:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href=${invitaionLink}
         style="display: inline-block; padding: 15px 30px; font-size: 18px; letter-spacing: 1px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        👉 Join Workspace
      </a>
    </div>
    <p style="font-size: 14px; color: #777;">If you did not request this, you can safely ignore this email.</p>
    <p style="margin-top: 40px; font-size: 16px;">Thanks,<br/><strong>GrideSync Team</strong></p>
  </div>
</div>

      `,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
