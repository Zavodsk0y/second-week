// From fastify-mailer docs

import { Transporter } from "nodemailer";

export interface FastifyMailerNamedInstance {
    [namespace: string]: Transporter;
}

export type FastifyMailer = FastifyMailerNamedInstance & Transporter;

declare module "fastify" {
    interface FastifyInstance {
        mailer: FastifyMailer;
    }
}
