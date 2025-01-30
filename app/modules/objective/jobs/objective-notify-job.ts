import { WebSocket } from "ws";
import { sqlCon } from "../../../common/config/kysely-config";
import { activeConnections } from "../../web-sockets/router.web-sockets";
import * as objectiveRepository from "../repository.objective";

export async function notifyJob() {
    const objectives = await objectiveRepository.findTasksToNotify(sqlCon);

    console.log(objectives);

    objectives.forEach((objective) => {
        const creatorId = objective.creatorId;
        const socket = activeConnections.get(creatorId);

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    type: "Notification",
                    objectiveId: objective.id,
                    message: "Notifying you about your objective!"
                })
            );
            console.log("sent!");
        }
    });
}
