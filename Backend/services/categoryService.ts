import { User } from "../entities/user";

export class UserService {
    
    static getAll(): User[] {
        return [
            {
                id: "1",
                name: "Licenças Ambientais"
            }
        ]
    }

    
}