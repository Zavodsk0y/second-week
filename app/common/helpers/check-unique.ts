import { HandlingErrorType } from "../enum/error-types";
import { HttpStatusCode } from "../enum/http-status-code";
import { CustomException } from "../exceptions/custom-exception";

export async function checkUniqueField(repositoryMethod: (sqlCon: any, value: string) => Promise<any>, sqlCon: any, value: string, property: string): Promise<boolean> {
    const exists = await repositoryMethod(sqlCon, value);
    if (exists) {
        throw new CustomException(HttpStatusCode.CONFLICT, "Conflict", {
            type: HandlingErrorType.Unique,
            property,
            publicMessage: `Поле ${property} должно быть уникальным.`
        });
    }
    return true;
}
