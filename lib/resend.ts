import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorToken = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Your verification code",
    html: `<h3>${token}</h3>`,
  });
};

export const sendVerificationToken = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Comfirm your email",
    html: `<p> <a href="${confirmLink}">Click here</a> to confirm email </p>`,
  });
};

export const sendResetPasswordToken = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-reset?token=${token}`;
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p> <a href="${resetLink}">Click here</a> to confirm email </p>`,
  });
};
