import { EmailService } from "../connectors/emailService";
import { User } from "../models/users";

export async function addBirthdayMessageScheduler(user: User): Promise<void> {
  const emailService = new EmailService();
  emailService.sendEmail(user.email, user.full_name);
}
