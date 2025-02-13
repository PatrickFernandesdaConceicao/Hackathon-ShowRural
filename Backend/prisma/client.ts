import { PrismaClient } from '@prisma/client';

export class PrismaDB {
    private static _prisma: null | PrismaClient = null;


    static get prisma() {
        if (!this._prisma) {
            this._prisma = new PrismaClient();
        }
        return this._prisma;
    }
}
    