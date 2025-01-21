import { FastifyRequest } from "fastify";
import { HttpStatusCode } from "../../../common/enum/http-status-code";
import { CustomException } from "../../../common/exceptions/custom-exception";
import { checkObjectiveExists } from "./check-objective-exists";

export async function checkObjectivePolicy(id: string, req: FastifyRequest) {
    const objective = await checkObjectiveExists(id);

    if (objective.creatorId !== req.user.id) {
        throw new CustomException(HttpStatusCode.FORBIDDEN, "Access denied", {
            publicMessage: "У вас нет доступа к этой задаче"
        });
    }
    return objective;
}
