import crypto from 'crypto';
import { NextResponse } from 'next/server';

export const OTP_EXPIRY_MINUTES = 10;
export const RESET_TOKEN_EXPIRY_MINUTES = 15;

export function hashValue(val) {
  if (!val) return '';
  return crypto.createHash('sha256').update(String(val)).digest('hex');
}

export function normalizeEmail(email) {
  return email ? String(email).toLowerCase().trim() : '';
}

export function respond(res, status, success, message, extra = {}) {
  return NextResponse.json(
    {
      success,
      message,
      ...extra,
    },
    { status }
  );
}

export function getPasswordResetEmail(otp) {
  const subject = 'Your Password Reset OTP - Finasset Wealth Admin';
  const text = `Your Finasset Wealth Administrator password reset OTP is: ${otp}. It will expire in ${OTP_EXPIRY_MINUTES} minutes. If you did not request this, please disregard this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #10243A; margin: 0; font-size: 22px; font-weight: bold;">FINASSET <span style="color: #C7A76C;">WEALTH</span></h2>
        <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">NLF Adhira Asset Services LLP</p>
      </div>
      
      <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello Administrator,</p>
      <p style="color: #334155; font-size: 14px; line-height: 1.6;">You recently requested to reset your password for the Finasset Wealth Administration Portal. Use the verification OTP below to proceed:</p>
      
      <div style="background-color: #F8F7F3; border: 1px dashed #C7A76C; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #10243A;">${otp}</span>
        <p style="color: #64748b; font-size: 12px; margin: 6px 0 0 0;">This OTP expires in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.</p>
      </div>
      
      <p style="color: #64748b; font-size: 13px; line-height: 1.5;">If you did not initiate this password reset, please ensure your account credentials are secure or contact technical support immediately.</p>
      
      <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">Finasset Wealth • Plot No. 124, Saheed Nagar, Janpath Road, Bhubaneswar, Odisha</p>
    </div>
  `;

  return { subject, text, html };
}

export default {
  hashValue,
  normalizeEmail,
  respond,
  getPasswordResetEmail,
  OTP_EXPIRY_MINUTES,
  RESET_TOKEN_EXPIRY_MINUTES,
};
