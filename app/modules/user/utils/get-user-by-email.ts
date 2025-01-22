import { sqlCon } from "../../../common/config/kysely-config";
import { HttpStatusCode } from "../../../common/enum/http-status-code";
import { CustomException } from "../../../common/exceptions/custom-exception";
import * as userRepository from "../repository.user";

export async function getUserByEmail(email: string): Promise<any> {
    const user = await userRepository.getByEmail(sqlCon, email);
    if (!user) {
        throw new CustomException(HttpStatusCode.NOT_FOUND, "User not found", {
            publicMessage: "User not found"
        });
    }
    return user;
}
