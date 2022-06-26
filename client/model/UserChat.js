import { Message } from "./Message";
import { UserData} from "./users/UserData";

export class UserChat extends UserData{
    constructor(userData){
        super(userData);
        this.lastMessage = userData.lastMessage;
    }

}