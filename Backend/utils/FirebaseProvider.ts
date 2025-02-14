import * as admin from 'firebase-admin';
import { resolve } from 'path';
import { Notification } from '../entities/notification';
import { EmailProvider } from './EmailProvider';

const path = resolve(__dirname, "..", "files-docs-firebase-adminsdk-fbsvc-1a455bb31b.json");
const secret = require(path)

// Inicializando o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(secret),
  databaseURL: "https://files-docs-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Função para registrar notificação
export async function registerNotification(data: Notification) {
  const notificacaoRef = db.ref('notificacoes/' + data.id_document);

  await notificacaoRef.set({
    title_document: data.title_document,
    id_document: data.id_document,
    dateNotification: data.dateNotification,
    status: data.status, 
  });
}

export async function getPendingNotifications(): Promise<Notification[]> {
  const notificacoesRef = db.ref('notificacoes');
  
  const snapshot = await notificacoesRef
    .orderByChild('status')  // Ordena por campo 'status'
    .equalTo('pending')      // Filtra por status 'pending'
    .once('value');          // Obtém o valor

  // Retorna as notificações pendentes
  const pendingNotifications: Notification[] = [];
  snapshot.forEach((childSnapshot) => {
    pendingNotifications.push({
      key: childSnapshot.key, // Chave do nó (ID da notificação)
      ...childSnapshot.val(), // Dados da notificação
    });
  });

  return pendingNotifications;
}

export async function updateStatusNotification(key: string, newStatus: string) {
  const notificacaoRef = db.ref('notificacoes').child(key);

  await notificacaoRef.update({
    status: newStatus,
  });
}