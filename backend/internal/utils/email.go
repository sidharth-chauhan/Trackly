package utils

import (
	"fmt"
	"net/smtp"
	"os"
)

func SendEmail(to, subject, body string) error {
	from := os.Getenv("EMAIL_USER")
	pass := os.Getenv("EMAIL_PASS")
	smtpHost := os.Getenv("EMAIL_HOST")
	smtpPort := os.Getenv("EMAIL_PORT")

	if from == "" || pass == "" || smtpHost == "" || smtpPort == "" {
		return fmt.Errorf("missing email configuration in environment variables")
	}

	msg := []byte("To: " + to + "\r\n" + "Subject: " + subject + "\r\n\r\n" + body + "\r\n")

	auth := smtp.PlainAuth("", from, pass, smtpHost)

	return smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, msg)
}
