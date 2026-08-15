import nodemailer from "nodemailer";
import {
  smtpUser,
  smtpPassword,
  smtpService,
  smtpHost,
  smtpPort,
  smtpSender,
} from "../config";

interface Attachment {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: smtpService,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
  }

 

  async sendEmail(
    to: string,
    subject: string,
    content: string,
    attachments: Attachment[] = []
  ): Promise<void> {
    const mailOptions: any = {
      from: smtpSender,
      to,
      subject,
      html: content,
    };

    if (attachments.length > 0) {
      mailOptions.attachments = attachments.map((attachment) => ({
        filename: attachment.filename,
        path: attachment.path,
        contentType: "application/pdf",
      }));
    }

    try {
      const data = await this.transporter.sendMail(mailOptions);
      //   console.log("Email sent:", data);
    } catch (error: any) {
      throw new Error(`Failed to send email: ${error}`);
    }
  }


  async sendEmails(
    to: string,
    subject: string,
    content: string
  ): Promise<void> {
    const mailOptions: any = {
      from: smtpSender,
      to,
      subject,
      html: content,
    };
    try {
      const data = await this.transporter.sendMail(mailOptions);
    } catch (error: any) {
      console.log("Failed to send email", error);
      //throw new Error("Failed to send email", error);
    }
  }



  async sendCsv(
    to: string,
    subject: string,
    content: string,
    csvData: any
  ): Promise<void> {
    const mailOptions = {
      from: smtpSender,
      to,
      subject,
      html: content,
      attachments: [
        {
          filename: "data.csv",
          content: csvData,
          contentType: "text/csv",
        },
      ],
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error: any) {
      console.log("Failed to send emai", error);
    }
  }
}
