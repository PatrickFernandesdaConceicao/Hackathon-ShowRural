import { Notification } from "../entities/notification";
import { registerNotification } from "../utils/FirebaseProvider";

export class NotificationService {
    
    static async create(data: Notification) {
        const newNotification = await registerNotification(data);
    }
}
