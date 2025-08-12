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

	// Create the HTML body for the email
	htmlBody := `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #d9534f;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
            color: #333333;
            line-height: 1.6;
        }
        .content p {
            margin: 0 0 15px;
        }
        .project-details {
            background-color: #f9f9f9;
            border: 1px solid #eeeeee;
            padding: 15px;
            border-radius: 5px;
        }
        .footer {
            background-color: #f4f4f4;
            color: #888888;
            font-size: 12px;
            text-align: center;
            padding: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Project Status Alert</h1>
        </div>
        <div class="content">
            <p>Heads up! One of your projects is currently unresponsive.</p>
            <div class="project-details">` +
		body +
		`</div>
            <p>Please check your project's dashboard for more details.</p>
        </div>
        <div class="footer">
            <p>This is an automated notification from Trackly.</p>
        </div>
    </div>
</body>
</html>
`

	// Construct the email message with HTML headers
	// This tells the email client to render the message as HTML
	msg := []byte("To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"MIME-version: 1.0;\n" +
		"Content-Type: text/html; charset=\"UTF-8\";\n\n" +
		htmlBody + "\r\n")

	auth := smtp.PlainAuth("", from, pass, smtpHost)

	return smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, msg)
}
