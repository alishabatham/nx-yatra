import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER || 'alisha021004@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'pzic kurl tydr epmb';
const EMAIL_TO = process.env.EMAIL_TO || 'hr@nexisparkx.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export interface SendInquiryNotificationArgs {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  businessType: string;
  message: string;
  reference: string;
}

export const sendInquiryEmail = async (inquiry: SendInquiryNotificationArgs): Promise<boolean> => {
  const mailOptions = {
    from: `"NX Yatra Enquiries" <${EMAIL_USER}>`,
    to: EMAIL_TO,
    subject: `[New Enquiry] ${inquiry.businessName} - ${inquiry.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ded8ca; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #1d3934; color: #f7f4eb; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">NX YATRA</h2>
          <p style="margin: 6px 0 0; font-size: 12px; color: #e4a38c; text-transform: uppercase; letter-spacing: 2px;">New Business Enquiry Received</p>
        </div>
        
        <div style="padding: 24px; color: #1d3934;">
          <p style="font-size: 15px; margin-top: 0; line-height: 1.6;">
            A new business enquiry has been submitted on the <strong>NX Yatra</strong> platform. Below are the details:
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
            <tr style="background-color: #f7f4eb;">
              <td style="padding: 10px 12px; font-weight: bold; border-bottom: 1px solid #ded8ca; width: 35%;">Reference ID:</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #ded8ca; font-family: monospace; font-weight: bold; color: #df6f50;">${inquiry.reference}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: bold; border-bottom: 1px solid #ded8ca;">Contact Person:</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #ded8ca;">${inquiry.name}</td>
            </tr>
            <tr style="background-color: #f7f4eb;">
              <td style="padding: 10px 12px; font-weight: bold; border-bottom: 1px solid #ded8ca;">Business Name:</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #ded8ca;"><strong>${inquiry.businessName}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: bold; border-bottom: 1px solid #ded8ca;">Business Type:</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #ded8ca;">${inquiry.businessType}</td>
            </tr>
            <tr style="background-color: #f7f4eb;">
              <td style="padding: 10px 12px; font-weight: bold; border-bottom: 1px solid #ded8ca;">Phone:</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #ded8ca;"><a href="tel:${inquiry.phone}" style="color: #1d3934; text-decoration: none; font-weight: bold;">${inquiry.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; font-weight: bold; border-bottom: 1px solid #ded8ca;">Email:</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #ded8ca;"><a href="mailto:${inquiry.email}" style="color: #df6f50; text-decoration: none;">${inquiry.email}</a></td>
            </tr>
          </table>

          <div style="margin-top: 24px;">
            <strong style="display: block; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #df6f50; margin-bottom: 8px;">Enquiry Message:</strong>
            <div style="background-color: #f1ede2; padding: 16px; border-radius: 8px; border-left: 4px solid #df6f50; font-size: 14px; line-height: 1.6; color: #233e38; white-space: pre-wrap;">${inquiry.message}</div>
          </div>
        </div>

        <div style="background-color: #162e29; color: #a9bbb0; padding: 16px; text-align: center; font-size: 11px;">
          NX Yatra · Digital Growth Partner for Travel & Yatra Businesses<br/>
          <span style="font-size: 10px; color: #697c72;">A NexisparkX Group Product</span>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer] Success: Email notification sent to ${EMAIL_TO}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('[Nodemailer Error]: Failed to send email notification:', error);
    return false;
  }
};
