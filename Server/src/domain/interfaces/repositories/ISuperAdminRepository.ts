export interface ISuperAdminRepository {
    getAllCount(): Promise<any>
    getAllWorkspace(): Promise<any>
    getAllUsers(): Promise<any>
    getUserDetails(userId: string): Promise<any>
    getSubscription(): Promise<any>
}


