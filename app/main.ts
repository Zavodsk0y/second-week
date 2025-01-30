import { fastifyAuth } from "@fastify/auth";
import { fastifyCors } from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastifyWebsocket } from "@fastify/websocket";
import { fastify, type FastifyInstance } from "fastify";
import { fastifyMailer } from "fastify-mailer";
import cron from "node-cron";
import { globalAuthHook } from "./common/config/global-auth";
import { jwtOption } from "./common/config/jwt";
import { KyselyConfig } from "./common/config/kysely-config";
import { mailerOption } from "./common/config/mailer";
import { logger } from "./common/config/pino-plugin";
import { AppErrorPipe, ZodValidatorCompiler } from "./common/config/pipe";
import { swaggerOption, swaggerUiOption } from "./common/config/swagger";
import { HttpProvider } from "./modules/_index";
import { notifyJob } from "./modules/objective/jobs/objective-notify-job";

async function app() {
    const app: FastifyInstance = fastify();
    const port: number = Number(process.env.APP_PORT!);
    const host: string = process.env.APP_HOST!;
    app.setValidatorCompiler(ZodValidatorCompiler);
    app.setErrorHandler(AppErrorPipe);
    await app.register(fastifyCors, {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Content-Disposition"]
    });

    app.register(fastifySwagger, swaggerOption);
    app.register(fastifySwaggerUi, swaggerUiOption);
    await app.register(KyselyConfig);
    await app.register(fastifyJwt, jwtOption);
    await app.register(fastifyMailer, mailerOption);
    await app.register(fastifyAuth, { defaultRelation: "or" });
    await app.register(fastifyWebsocket);
    // await globalAuthHook(app);

    cron.schedule("* * * * *", async () => {
        console.log("Running a task every minute");
        await notifyJob();
    });

    HttpProvider.forEach((router) => app.register(router.instance, { prefix: router.prefix }));

    app.listen({ host, port }, (e, address) => {
        if (e) {
            logger.info(`[APP] App crashed while starting. Details:`);
            logger.error(e);
            process.exit(1);
        }
        logger.info(`[APP] Server listening on ${address}`);
    });
}

void app();
