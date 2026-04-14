export interface EmailField {
  email: string;
  role: "member";
}
export interface TeamMember {
  name: string;
  position: string;
  team?: string;
  avatar: string;
}