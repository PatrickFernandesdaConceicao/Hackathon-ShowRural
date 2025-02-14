export interface Notification {
    id_document: string,
    title_document: string,
    dateNotification: string,
    status: 'pending' | 'sended',
}