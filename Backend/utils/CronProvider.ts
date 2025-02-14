import cron from "node-cron"
import { getPendingNotifications, updateStatusNotification } from "./FirebaseProvider";
import { EmailProvider } from "./EmailProvider";

export async function listenNotifications() {
    cron.schedule('* * * * *', async () => {
        console.log('Verificando notificações a cada minuto...');
        
        const notifications = await getPendingNotifications();
        
        notifications.forEach(async (notificacao) => {
            const { id_document, dateNotification, status, title_document } = notificacao;
            const dateIsos = new Date(dateNotification).toISOString().split('T')[0];
        
            if (status === 'pending' && dateIsos <= new Date().toISOString().split('T')[0]) {
                await EmailProvider.sendEmail({
                    corpo: "Teste",
                    to: "patrickfernandesconceicao@gmail.com",
                    subject: "Teste",
                    titulo: title_document,
                    text: "Teste"
                });
        
                await updateStatusNotification(id_document, 'enviado');
            }
        })
    });
}