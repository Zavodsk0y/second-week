import { FastifyReply } from "fastify";
import type { IHandlingResponseError } from "../../../common/config/http-response";
import { sqlCon } from "../../../common/config/kysely-config";
import { HandlingErrorType } from "../../../common/enum/error-types";
import { HttpStatusCode } from "../../../common/enum/http-status-code";
import * as objectiveRepository from "../repository.objective";

export async function checkObjectiveExists(id: string, rep: FastifyReply) {
    const objective = await objectiveRepository.getById(sqlCon, id);

    if (!objective) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Found, property: "id" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }
    return objective;
}
