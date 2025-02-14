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
                    to: "patrickfernandesconceicao@gmail.com",
                    subject: `O documento "${title_document}" entrou na data de notificação e precisa ser verificado.`,
                    titulo: "Notificação de Documento para Verificação",
                    text: `Olá,\nInformamos que o documento **"${title_document}"** entrou na data de notificação e precisa ser verificado.\nPor favor, acesse o sistema para revisar e tomar as devidas providências.\nAtenciosamente,\nDocus`
                });
                console.log("Enviou notificação");
        
                await updateStatusNotification(id_document, 'enviado');
            }
        })
    });
}