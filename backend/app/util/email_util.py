import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from app.config.logging_config import logger

class EmailUtil:
    @staticmethod
    def _dispatch(to_email: str, subject: str, html_body: str) -> bool:
        smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.environ.get("SMTP_PORT", 587))
        smtp_user = os.environ.get("SMTP_USER", "")
        smtp_pass = os.environ.get("SMTP_PASS", "")
        from_email = os.environ.get("SMTP_FROM", smtp_user)

        if not smtp_user or not smtp_pass:
            logger.warning(f"SMTP credentials not configured. Email to {to_email} not sent.")
            return False

        try:
            msg = MIMEMultipart()
            msg['From'] = from_email
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(html_body, 'html'))

            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.send_message(msg)

            logger.info(f"Email sent to {to_email}: {subject}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False

    @staticmethod
    def send_verification_email(to_email: str, code: str):
        subject = "Verify Your Email - Assignment System"
        body = f"""
        <h1>Email Verification</h1>
        <p>Thank you for registering. Please use the following code to verify your email address:</p>
        <h2 style="color: #4a90e2; letter-spacing: 5px;">{code}</h2>
        <p>This code will expire in 15 minutes.</p>
        """
        logger.info(f"VERIFICATION CODE for {to_email}: {code}")
        return EmailUtil._dispatch(to_email, subject, body)

    @staticmethod
    def send_password_reset_email(to_email: str, code: str):
        subject = "Reset Your Password - Assignment System"
        body = f"""
        <h1>Password Reset</h1>
        <p>You have requested to reset your password. Please use the following code to proceed:</p>
        <h2 style="color: #e67e22; letter-spacing: 5px;">{code}</h2>
        <p>This code will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        """
        logger.info(f"PASSWORD RESET CODE for {to_email}: {code}")
        return EmailUtil._dispatch(to_email, subject, body)

    @staticmethod
    def send_custom_email(to_email: str, subject: str, message: str):
        """Send an admin-composed email with a plain-text message rendered into a simple HTML template."""
        safe_message = message.replace("\n", "<br>")
        body = f"""
        <h2 style="color: #4a90e2;">{subject}</h2>
        <p style="white-space: pre-wrap;">{safe_message}</p>
        <hr>
        <p style="color: #888; font-size: 12px;">This message was sent by an administrator of the Assignment System.</p>
        """
        return EmailUtil._dispatch(to_email, subject, body)
