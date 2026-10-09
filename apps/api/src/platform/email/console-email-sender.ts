import type { EmailSender, SendEmailInput } from './email-sender.js';

export class ConsoleEmailSender implements EmailSender {
  async send(input: SendEmailInput): Promise<void> {
    console.log('--- EMAIL ---');
    console.log(`To: ${input.to}`);
    console.log(`Subject: ${input.subject}`);
    console.log(input.text);
    console.log('-------------');
  }
}
