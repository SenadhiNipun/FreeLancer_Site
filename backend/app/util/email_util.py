import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from app.config.logging_config import logger

class EmailUtil:
    @staticmethod
    def send_verification_email(to_email: str, code: str):
        smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.environ.get("SMTP_PORT", 587))
        smtp_user = os.environ.get("SMTP_USER", "")
        smtp_pass = os.environ.get("SMTP_PASS", "")
        from_email = os.environ.get("SMTP_FROM", smtp_user)

        subject = "Verify Your Email - Assignment System"
        body = f"""
        <h1>Email Verification</h1>
        <p>Thank you for registering. Please use the following code to verify your email address:</p>
        <h2 style="color: #4a90e2; letter-spacing: 5px;">{code}</h2>
        <p>This code will expire in 15 minutes.</p>
        """

        # Log the code for development/testing if SMTP is not configured
        logger.info(f"VERIFICATION CODE for {to_email}: {code}")

        if not smtp_user or not smtp_pass:
            logger.warning("SMTP credentials not configured. Email not sent, but code logged above.")
            return False

        try:
            msg = MIMEMultipart()
            msg['From'] = from_email
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'html'))

            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.send_message(msg)

            logger.info(f"Verification email sent to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return False

    @staticmethod
    def send_password_reset_email(to_email: str, code: str):
        smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.environ.get("SMTP_PORT", 587))
        smtp_user = os.environ.get("SMTP_USER", "")
        smtp_pass = os.environ.get("SMTP_PASS", "")
        from_email = os.environ.get("SMTP_FROM", smtp_user)

        subject = "Reset Your Password - Assignment System"
        body = f"""
        <h1>Password Reset</h1>
        <p>You have requested to reset your password. Please use the following code to proceed:</p>
        <h2 style="color: #e67e22; letter-spacing: 5px;">{code}</h2>
        <p>This code will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        """

        # Log the code for development/testing if SMTP is not configured
        logger.info(f"PASSWORD RESET CODE for {to_email}: {code}")

        if not smtp_user or not smtp_pass:
            logger.warning("SMTP credentials not configured. Reset email not sent, but code logged above.")
            return False

        try:
            msg = MIMEMultipart()
            msg['From'] = from_email
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'html'))

            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.send_message(msg)

            logger.info(f"Password reset email sent to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send reset email: {e}")
            return False
