import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Ensure SEND_GMAIL is provided
if (!process.env.SEND_GMAIL) {
    console.log("Please provide SEND_GMAIL in the .env file");
}

const sendEmail = async ({ sendTo, subject, html }) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
            user: 'yogeshkaswan2023@gmail.com', // Your Gmail address
            pass: process.env.SEND_GMAIL, // Your Gmail app password
        },
    });

    // Email details
    const receiver = {
        from: 'yogeshkaswan2023@gmail.com', // Sender email
        to: sendTo, // Recipient email
        subject: subject, // Email subject
        html: html, // Email content
    };

    try {
        // Send email
        const info = await transporter.sendMail(receiver);
        console.log('Email sent successfully:', info.response);
        return info; // Return email info for further processing
    } catch (error) {
        // Handle email sending errors
        console.error('Error sending email:', error);
    }
};

export default sendEmail;
