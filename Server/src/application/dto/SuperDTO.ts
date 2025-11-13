export interface UserResponse {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  status: string
  workspace: {
    name: string
    plan: string | null
  }
  joinedAt: string
  lastActivity: string
  loginCount: number
  isEmailVerified: boolean
  twoFactorEnabled: boolean
}
