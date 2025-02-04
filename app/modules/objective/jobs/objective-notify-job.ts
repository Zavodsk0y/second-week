import { sqlCon } from "../../../common/config/kysely-config";
import * as objectiveRepository from "../repository.objective";
import { sendObjectiveNotification } from "../utils/send-objective-notification";

export async function notifyJob() {
    const objectives = await objectiveRepository.findTasksToNotify(sqlCon);

    await Promise.all(
        objectives.map(async (objective) => {
            const creatorId = objective.creatorId;
            sendObjectiveNotification(creatorId, {
                type: "Notification",
                objectiveId: objective.id,
                message: "Notifying you about your objective!"
            });
        })
    );
}
