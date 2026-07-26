import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ResendEmailService {
  private readonly apiKey = process.env.RESEND_API_KEY || '';
  private readonly fromEmail = 'Kids-Oasis <onboarding@resend.dev>';

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from: this.fromEmail,
          to: [to],
          subject: subject,
          html: html,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`[Resend Email Success] Dispatched to ${to}: ID ${response.data?.id}`);
      return true;
    } catch (err: any) {
      console.warn(`[Resend Email Info] Failed to send via Resend API: ${err.response?.data?.message || err.message}`);
      return false;
    }
  }

  async sendPaymentReceipt(parentEmail: string, parentName: string, academyName: string, amount: number, transactionId: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #FAFAFC; color: #1E293B;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #E2E8F0;">
          <h2 style="color: #4F46E5; margin-bottom: 8px;">💳 Kids-Oasis Payment Receipt</h2>
          <p style="font-size: 14px; color: #64748B;">Hello <strong>${parentName}</strong>,</p>
          <p style="font-size: 14px; color: #64748B;">Your tuition payment for <strong>${academyName}</strong> has been successfully processed via Stripe.</p>
          
          <div style="background-color: #F8FAFC; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
              <span>Amount Paid:</span>
              <strong style="color: #10B981;">EGP ${amount.toLocaleString()}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 14px;">
              <span>Transaction ID:</span>
              <strong style="color: #4F46E5;">${transactionId}</strong>
            </div>
          </div>

          <p style="font-size: 12px; color: #94A3B8; margin-top: 20px;">Thank you for trusting Kids-Oasis for your child's education!</p>
        </div>
      </div>
    `;
    return this.sendEmail(parentEmail, `Payment Confirmation - ${academyName}`, html);
  }

  async sendEnrollmentApproval(parentEmail: string, parentName: string, childName: string, academyName: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #FAFAFC; color: #1E293B;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #E2E8F0;">
          <h2 style="color: #10B981; margin-bottom: 8px;">🎉 Application Approved!</h2>
          <p style="font-size: 14px; color: #64748B;">Dear <strong>${parentName}</strong>,</p>
          <p style="font-size: 14px; color: #64748B;">We are thrilled to inform you that <strong>${childName}</strong>'s enrollment application for <strong>${academyName}</strong> has been <strong>Approved</strong>!</p>
          
          <p style="font-size: 14px; color: #64748B;">You can now log in to your Parent Dashboard to complete your tuition payment via Stripe.</p>
          
          <a href="http://localhost:3000/en/dashboard/parent" style="display: inline-block; background-color: #4F46E5; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 16px;">Go to Parent Dashboard</a>
        </div>
      </div>
    `;
    return this.sendEmail(parentEmail, `Enrollment Approved - ${childName}`, html);
  }
}
