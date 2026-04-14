import {  AdminSignupResponseDTO } from "../dto/AuthDTOs"
import { MailRequestDTO } from "../dto/MailDTO"

export interface IOTP {
    sendOTP(input:MailRequestDTO):Promise<string>
    verifyOTP(input:MailRequestDTO):Promise<AdminSignupResponseDTO>
    reSendOTP(email:string):Promise<void>
}