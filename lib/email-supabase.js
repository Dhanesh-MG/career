import { db } from "./supabase"
import { getCurrentUser } from "./auth-supabase"

export async function sendEmail({ to, subject, html, applicationId, templateType }) {
  // Simulate email sending - in production, you'd use a service like Resend, SendGrid, etc.
  console.log("Sending email:", { to, subject, html })

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Log the email
  const currentUser = await getCurrentUser()
  await db.createEmailLog({
    application_id: applicationId,
    sent_by: currentUser?.id,
    recipient_email: to,
    subject,
    template_type: templateType,
  })

  return { success: true, message: "Email sent successfully" }
}

export const emailTemplates = {
  applicationReceived: (applicantName, jobTitle) => ({
    subject: `Application Received - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
          <h1>TechCorp</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Thank you for your application!</h2>
          <p>Dear ${applicantName},</p>
          <p>We have received your application for the <strong>${jobTitle}</strong> position at TechCorp.</p>
          <p>Our hiring team will review your application and get back to you within 5-7 business days.</p>
          <p>If you have any questions, please don't hesitate to contact us at careers@techcorp.com</p>
          <p>Best regards,<br>TechCorp Hiring Team</p>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>TechCorp | 123 Tech Street, San Francisco, CA 94105</p>
        </div>
      </div>
    `,
  }),

  applicationAccepted: (applicantName, jobTitle) => ({
    subject: `Great News! Next Steps for ${jobTitle} Position`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #059669; color: white; padding: 20px; text-align: center;">
          <h1>TechCorp</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Congratulations!</h2>
          <p>Dear ${applicantName},</p>
          <p>We're excited to inform you that your application for the <strong>${jobTitle}</strong> position has been accepted for the next round!</p>
          <p>We were impressed by your qualifications and would like to schedule an interview with you.</p>
          <p>Our HR team will contact you within the next 2 business days to schedule your interview.</p>
          <p>We look forward to speaking with you soon!</p>
          <p>Best regards,<br>TechCorp Hiring Team</p>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>TechCorp | 123 Tech Street, San Francisco, CA 94105</p>
        </div>
      </div>
    `,
  }),

  applicationRejected: (applicantName, jobTitle) => ({
    subject: `Update on Your Application - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
          <h1>TechCorp</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Thank you for your interest</h2>
          <p>Dear ${applicantName},</p>
          <p>Thank you for your interest in the <strong>${jobTitle}</strong> position at TechCorp.</p>
          <p>After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.</p>
          <p>We were impressed by your background and encourage you to apply for future opportunities that match your skills.</p>
          <p>We'll keep your resume on file and will reach out if a suitable position becomes available.</p>
          <p>Thank you again for your time and interest in TechCorp.</p>
          <p>Best regards,<br>TechCorp Hiring Team</p>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>TechCorp | 123 Tech Street, San Francisco, CA 94105</p>
        </div>
      </div>
    `,
  }),
}
