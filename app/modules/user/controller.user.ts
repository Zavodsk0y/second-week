import bcrypt from "bcrypt";
import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { CustomException } from "../../common/exceptions/custom-exception";
import { checkUniqueField } from "../../common/helpers/check-unique";
import * as userRepository from "./repository.user";
import type { loginSchema } from "./schemas/login.schema.ts";
import type { signUpSchema } from "./schemas/sign-up.schema.ts";

const generateJwt = (id: string, email: string) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export async function create(req: FastifyRequest<{ Body: signUpSchema }>, rep: FastifyReply) {
    await checkUniqueField(userRepository.getByEmail, sqlCon, req.body.email, "email");
    await checkUniqueField(userRepository.getByLogin, sqlCon, req.body.login, "login");

    const hashPassword = await bcrypt.hash(req.body.password, 5);

    const user = {
        name: req.body.name,
        email: req.body.email,
        login: req.body.login,
        password: hashPassword
    };

    const insertedUser = await userRepository.insert(sqlCon, user);
    const token = generateJwt(insertedUser.id, insertedUser.email);

    const data = {
        id: insertedUser.id,
        accessToken: token
    };
    return rep.code(HttpStatusCode.OK).send(data);
}

export async function login(req: FastifyRequest<{ Body: loginSchema }>, rep: FastifyReply) {
    const user = await userRepository.getByEmail(sqlCon, req.body.email);
    if (!user) {
        throw new CustomException(HttpStatusCode.NOT_FOUND, "User not found", {
            publicMessage: "User not found"
        });
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password!);
    if (!isPasswordValid) {
        throw new CustomException(HttpStatusCode.UNAUTHORIZED, "Passwords don't match", {
            publicMessage: "Passwords don't match"
        });
    }
    const token = generateJwt(user.id, user.email);

    const data = {
        id: user.id,
        accessToken: token
    };

    return rep.code(HttpStatusCode.OK).send(data);
}
