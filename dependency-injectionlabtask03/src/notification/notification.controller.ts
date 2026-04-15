import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('send')
  sendNotification(
    @Body() body: { studentName: string; message: string },
  ) {
    const { studentName, message } = body;
    return this.notificationService.sendNotification(studentName, message);
  }

  @Post('check')
  checkEnrollment(
    @Body() body: { studentName: string; courseId: string },
  ) {
    const { studentName, courseId } = body;
    return this.notificationService.checkEnrollmentAndNotify(
      studentName,
      courseId,
    );
  }
}