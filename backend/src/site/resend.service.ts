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
          
          <a href="http://localhost:3000/en/dashboard/parent" style="display: inline-block; background-color: #4F46E5; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 16px;">Go to Parent Dashboard & Pay Tuition</a>
        </div>
      </div>
    `;
    return this.sendEmail(parentEmail, `Enrollment Approved - ${childName}`, html);
  }

  async sendEnrollmentDeclined(parentEmail: string, parentName: string, childName: string, academyName: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #FAFAFC; color: #1E293B;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #E2E8F0;">
          <h2 style="color: #EF4444; margin-bottom: 8px;">Application Status Update</h2>
          <p style="font-size: 14px; color: #64748B;">Dear <strong>${parentName}</strong>,</p>
          <p style="font-size: 14px; color: #64748B;">Thank you for applying to <strong>${academyName}</strong> for <strong>${childName}</strong>.</p>
          
          <div style="background-color: #FEF2F2; border-radius: 12px; padding: 16px; margin: 16px 0; border: 1px solid #FCA5A5; color: #991B1B; font-size: 13px;">
            After careful review of current seat capacity and age specifications, we regret to inform you that we are currently unable to accept this application at this time.
          </div>
          
          <p style="font-size: 13px; color: #64748B;">We encourage you to explore other accredited academies and nurseries on Kids-Oasis!</p>
          <a href="http://localhost:3000/en/academies" style="display: inline-block; background-color: #0EA5E9; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; margin-top: 12px;">Explore Other Academies</a>
        </div>
      </div>
    `;
    return this.sendEmail(parentEmail, `Application Status - ${academyName}`, html);
  }

  async sendAcademyApproval(ownerEmail: string, ownerName: string, academyName: string, commissionRate: number = 10) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #FAFAFC; color: #1E293B;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #E2E8F0;">
          <h2 style="color: #4F46E5; margin-bottom: 8px;">🏢 Academy Onboarding Verified & Contract Active</h2>
          <p style="font-size: 14px; color: #64748B;">Dear <strong>${ownerName}</strong>,</p>
          <p style="font-size: 14px; color: #64748B;">Congratulations! Your academy <strong>${academyName}</strong> has been officially verified and approved by the Kids-Oasis System Administrator.</p>
          
          <div style="background-color: #EEF2FF; border-radius: 12px; padding: 16px; margin: 16px 0; border: 1px solid #C7D2FE; color: #3730A3; font-size: 13px;">
            <strong>Platform Partner Agreement Active:</strong> Kids-Oasis platform schedule specifies a standard <strong>${commissionRate}% platform commission</strong> per paid student enrollment. Net tuition proceeds (90%) are disbursed to your registered bank account.
          </div>
          
          <a href="http://localhost:3000/en/dashboard/academy" style="display: inline-block; background-color: #4F46E5; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px;">Go to Academy Dashboard</a>
        </div>
      </div>
    `;
    return this.sendEmail(ownerEmail, `Partner Contract Activated - ${academyName}`, html);
  }
}

