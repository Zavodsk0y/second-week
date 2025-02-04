import { sqlCon } from "../../../common/config/kysely-config";
import { HttpStatusCode } from "../../../common/enum/http-status-code";
import { CustomException } from "../../../common/exceptions/custom-exception";
import * as objectiveRepository from "../repository.objective";

export async function checkObjectiveExists(id: string) {
    const objective = await objectiveRepository.getById(sqlCon, id);

    if (!objective) {
        throw new CustomException(HttpStatusCode.NOT_FOUND, "Objective not found", {
            publicMessage: "Objective not found"
        });
    }
    return objective;
}
