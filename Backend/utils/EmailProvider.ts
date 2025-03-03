
import nodemailer from 'nodemailer';

export class EmailProvider {
    private static transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'deathboooom@gmail.com',
            pass: process.env.APP_PAS,
        },
    });

    static async sendEmail(props: {
        to: string,
        subject: string,
        text: string,
        titulo: string
    }) {
        const mailOptions = {
            from: "deathboooom@gmail.com",
            to: props.to,
            subject: props.subject,
            text: props.text,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('E-mail sended with succefully!');
        } catch (error) {
            console.error('Error to send the email:', error);
        }
    }
}