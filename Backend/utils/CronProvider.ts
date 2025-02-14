import cron from "node-cron"
import { getPendingNotifications, updateStatusNotification } from "./FirebaseProvider";
import { EmailProvider } from "./EmailProvider";

export function listenNotifications() {
    cron.schedule('* * * * *', async () => {
        console.log('Verificando notificações a cada minuto...');
        
        const notifications = await getPendingNotifications();
        
        for (let notificacao of notifications) {
            const { id_document, dateNotification, status, title_document } = notificacao;

            const dateIsos = new Date(dateNotification).toISOString().split('T')[0];
            console.log("Coisas: ", dateIsos);
        
            if (status === 'pending' && dateNotification <= new Date().toISOString().split('T')[0]) {
                await EmailProvider.sendEmail({
                    corpo: "Teste",
                    from: "leonardo.valerio@escola.pr.gov.br",
                    to: "patrickfernandesconceicao@gmail.com",
                    subject: "Teste",
                    titulo: title_document,
                    text: "Teste"
                });
                console.log(`Enviado e-mail para o documento ${id_document}`);
        
                // Atualizar o status da notificação no banco (pode ser PostgreSQL, Firebase, etc.)
                await updateStatusNotification(id_document, 'enviado');
            }
        }
    });
}