import axios from "axios";
import { log } from "@temporalio/activity";

const BASE_URL = "https://email-service.digitalenvision.com.au/send-email";

export class EmailService {
  async sendEmail(email: string, full_name: string): Promise<boolean> {
    const message = `Hey, ${full_name} it’s your birthday`;

    try {
      const response = await axios.post(BASE_URL, {
        email,
        message,
      });

      if (response.status === 200) {
        log.info(`Success sending birthday message to ${email}`);
        return true;
      } else {
        log.error(
          `Failed sending birthday message to ${email}. Status: ${response.status}`,
        );
        return false;
      }
    } catch (error) {
      log.error(`Failed sending birthday message to ${email}. Error: ${error}`);
      throw error;
    }
  }
}
