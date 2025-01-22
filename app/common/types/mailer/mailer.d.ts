declare module "fastify-mailer" {
    import { FastifyPluginAsync } from "fastify";
    import { SendMailOptions, SentMessageInfo } from "nodemailer";

    // assigning interface for options
    interface FastifyMailerOptions {
        defaults: { from: string };
        transport: {
            host: string;
            port: number;
            secure: boolean;
            auth: {
                user: string;
                pass: string;
            };
        };
    }

    // assign own interface for mailer (nodemailer analogue)
    interface FastifyMailer {
        sendMail: (options: SendMailOptions, callback: (error: Error | null, info: SentMessageInfo) => void) => void;
    }

    // exporting our mailer with plugin
    export const fastifyMailer: FastifyPluginAsync<FastifyMailerOptions>;

    export interface FastifyInstance {
        mailer: FastifyMailer;
    }
}
