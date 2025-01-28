import { FastifyRequest } from "fastify";
import { HttpStatusCode } from "../../../common/enum/http-status-code";
import { CustomException } from "../../../common/exceptions/custom-exception";
import { IGetByUuidFSchema } from "../../../common/schemas/uuid.schema";
import { checkObjectiveExists } from "../utils/check-objective-exists";

export async function checkObjectivePolicyGet(req: FastifyRequest<IGetByUuidFSchema>) {
    const { id } = req.params;
    const objective = await checkObjectiveExists(id);
    if (objective.creatorId !== req.user.id) {
        throw new CustomException(HttpStatusCode.FORBIDDEN, "Access denied", {
            publicMessage: "You have no access to this objective"
        });
    }
}
