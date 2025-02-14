import { Notification } from "../entities/notification";
import { registerNotification } from "../utils/FirebaseProvider";

export class NotificationService {
    
    static async create(data: Notification) {
        if(!data) throw new Error("Data to notification doesn't sended!");
        if(
            !data.id_document ||
            !data.dateNotification ||
            !data.title_document
        ) 
        throw new Error("Correctly attributtes doens't sended to notification doesn't sended!");


        await registerNotification(data);
    }
}
