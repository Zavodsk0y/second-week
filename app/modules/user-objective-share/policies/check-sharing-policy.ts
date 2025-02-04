import { FastifyRequest } from "fastify";
import { sqlCon } from "../../../common/config/kysely-config";
import { HttpStatusCode } from "../../../common/enum/http-status-code";
import { CustomException } from "../../../common/exceptions/custom-exception";
import { IGetByUuidFSchema } from "../../../common/schemas/uuid.schema";
import { checkObjectiveExists } from "../../objective/utils/check-objective-exists";
import * as userObjectiveShareRepository from "../repository.user-objective-share";

export async function checkSharingPolicy(req: FastifyRequest<IGetByUuidFSchema>) {
    const { id } = req.params;
    const objective = await checkObjectiveExists(id);
    if (!(await userObjectiveShareRepository.findAccessByUserAndObjective(sqlCon, req.user.id!, objective.id))) {
        throw new CustomException(HttpStatusCode.FORBIDDEN, "Access denied", {
            publicMessage: { message: "You have no access to this objective" }
        });
    }
    return;
}
