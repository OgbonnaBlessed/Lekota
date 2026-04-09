export const baseTemplate = (content: string) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
      
      <div style="background:#2D36E0; color:white; padding:16px; text-align:center;">
        <h2 style="margin:0;">Lekota</h2>
      </div>

      <div style="padding:20px; color:#333;">
        ${content}
      </div>

      <div style="padding:16px; text-align:center; font-size:12px; color:#888;">
        © ${new Date().getFullYear()} Lekota. All rights reserved.
      </div>

    </div>
  </div>
  `;
};

export const welcomeEmail = (name: string, password: string) => {
  return baseTemplate(`
    <h3>Hello ${name},</h3>
    <p>Welcome to <b>Lekota</b> 🎉</p>

    <p>Your account has been created successfully.</p>

    <div style="background:#f1f5f9; padding:12px; border-radius:6px;">
      <p><b>Temporary Password:</b> ${password}</p>
    </div>

    <p>Please login and change your password immediately.</p>

    <p>We’re excited to have you onboard.</p>
  `);
};

export const forgotPasswordEmail = ({
  name,
  resetURL,
}: {
  name?: string;
  resetURL: string;
}) => {
  return baseTemplate(`
    <h3>Password Reset Request</h3>

    <p>Hello ${name || "there"},</p>

    <p>We received a request to reset your password for your <b>Lekota</b> account.</p>

    <p>Click the button below to reset your password:</p>

    <div style="text-align:center; margin:20px 0;">
      <a 
        href="${resetURL}" 
        style="
          background:#2D36E0;
          color:white;
          padding:12px 20px;
          text-decoration:none;
          border-radius:6px;
          display:inline-block;
          font-weight:bold;
        "
      >
        Reset Password
      </a>
    </div>

    <p>If the button above does not work, copy and paste the link below into your browser:</p>

    <p style="word-break:break-all; color:#2D36E0;">
      ${resetURL}
    </p>

    <p>This link will expire in <b>15 minutes</b> for security reasons.</p>

    <p>If you did not request this, you can safely ignore this email.</p>
  `);
};

export const bookingNotificationEmail = ({
  clientName,
  service,
  subService,
  startTime,
  reason,
}: {
  clientName?: string;
  service?: string;
  subService?: string;
  startTime?: string;
  reason?: string;
}) => {
  return baseTemplate(`
    <h3>New Appointment Booked</h3>

    <p><b>${clientName}</b> just booked an appointment with you.</p>

    <div style="background:#f1f5f9; padding:12px; border-radius:6px;">
      <p><b>Service:</b> ${service}</p>
      <p><b>Sub-service:</b> ${subService}</p>
      <p><b>Start Time:</b> ${startTime}</p>
    </div>

    ${reason ? `<p><b>Reason:</b> ${reason}</p>` : ""}

    <p>Please prepare accordingly.</p>
  `);
};

export const clientBookingConfirmationEmail = ({
  service,
  subService,
  startTime,
}: any) => {
  return baseTemplate(`
    <h3>Booking Confirmed ✅</h3>

    <p>Your appointment has been successfully scheduled.</p>

    <div style="background:#f1f5f9; padding:12px; border-radius:6px;">
      <p><b>Service:</b> ${service}</p>
      <p><b>Sub-service:</b> ${subService}</p>
      <p><b>Start Time:</b> ${startTime}</p>
    </div>

    <p>We look forward to serving you.</p>
  `);
};
