import { Invitation } from "../../domain/entities/Invitation"
import { IinvitationRepository } from "../../domain/interfaces/repositories/IInvitationRepository"
import { InvitationDocument, InvitationModel } from "../database/models/InvitationModel"
import { BaseRepository } from "./BaseRepository"

export class InvitaionRepository extends BaseRepository<Invitation,InvitationDocument> implements IinvitationRepository {
  constructor() {
    super(InvitationModel)
  }
  async findInvitaionLinkByEmail(email: string): Promise<Invitation | null> {
    const invitaion = await InvitationModel.findOne({ invitedTo: email }).lean()
    //    return invitaion as Invitation;
    if (invitaion) {
      return new Invitation({ ...invitaion, id: invitaion._id.toString(), workspaceId: invitaion.workspaceId?.toString() })
    }
    return null

  }
}