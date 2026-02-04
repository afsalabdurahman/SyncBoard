import { MailRequestDTO } from "../dto/MailDTO"

export interface IOTP {
    sendOTP(input:MailRequestDTO):Promise<string>
    verifyOTP(input:MailRequestDTO):Promise<boolean>
}