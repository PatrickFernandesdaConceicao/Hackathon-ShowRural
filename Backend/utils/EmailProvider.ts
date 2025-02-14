
import nodemailer from 'nodemailer';

export class EmailProvider {
    private static transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'leonardo.valerio@escola.pr.gov.br',
            pass: 'monograves',
        },
    });

    static async sendEmail(props: {
        from: string,
        to: string,
        subject: string,
        text: string,
        titulo: string, 
        corpo: string
    }) {
        const mailOptions = {
            from: props.from,
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