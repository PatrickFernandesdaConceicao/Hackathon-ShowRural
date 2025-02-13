import * as admin from 'firebase-admin';
import { resolve } from 'path';
import { Notification } from '../entities/notification';

// Inicializando o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(resolve(__dirname, "files-docs-firebase-adminsdk-fbsvc-1a455bb31b.json")),
});

const db = admin.database();

// Função para registrar notificação
export async function registerNotification(data: Notification) {
  const notificacaoRef = db.ref('notificacoes/' + data.id_document);

  await notificacaoRef.set({
    documentoId: data.id_document,
    dateNotification: data.dateNotification,
    status: data.status, 
  });

  console.log('Notificação registrada com sucesso no Firebase!');
}