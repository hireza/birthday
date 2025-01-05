import { ScheduleOverlapPolicy, Client } from "@temporalio/client";
import { birthdayWorkflow } from "./workflows";
import { config } from "../config";
import { User } from "../models/users";
import moment from "moment-timezone";
import logger from "../utils/logger";

function getMonthString(monthNumber: number) {
  switch (monthNumber) {
    case 0:
      return "JANUARY";
    case 1:
      return "FEBRUARY";
    case 2:
      return "MARCH";
    case 3:
      return "APRIL";
    case 4:
      return "MAY";
    case 5:
      return "JUNE";
    case 6:
      return "JULY";
    case 7:
      return "AUGUST";
    case 8:
      return "SEPTEMBER";
    case 9:
      return "OCTOBER";
    case 10:
      return "NOVEMBER";
    case 11:
      return "DECEMBER";
    default:
      throw new Error("Invalid month number");
  }
}

export class BirthdayWorkflow {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async addBirthdayWorkflow(user: User) {
    const userBirthday = moment(user.birthday)
      .clone()
      .set("hour", config.message.birthday.hour)
      .set("minute", config.message.birthday.minute);

    try {
      await this.client.schedule.create({
        action: {
          type: "startWorkflow",
          workflowType: birthdayWorkflow,
          args: [user],
          taskQueue: "schedules",
        },
        scheduleId: `happy-birthday-${user.email}`,
        policies: {
          catchupWindow: "1 day",
          overlap: ScheduleOverlapPolicy.ALLOW_ALL,
        },
        spec: {
          timezone: user.timezone,
          calendars: [
            {
              comment: "run at 9am user local time",
              month: getMonthString(userBirthday.month()),
              dayOfMonth: userBirthday.date(),
              hour: userBirthday.hour(),
              minute: userBirthday.minute(),
            },
          ],
        },
      });
      logger.info(`Scheduled birthday workflow for user: ${user.email}`);
    } catch (error) {
      logger.error(
        `Failed to schedule birthday workflow for user: ${user.email}`,
        error,
      );
    }
  }

  async deleteBirthdayWorkflow(user: User) {
    try {
      const handle = this.client.schedule.getHandle(
        `happy-birthday-${user.email}`,
      );
      await handle.delete();
      logger.info(`Deleted birthday workflow for user: ${user.email}`);
    } catch (error) {
      logger.error(
        `Failed to delete birthday workflow for user: ${user.email}`,
        error,
      );
    }
  }
}
