import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

/**
 * `/` belongs to the art homepage rather than the docs, so clicking the docs
 * site title lands on the quickstart instead of leaving the documentation.
 */
export const onRequest = defineRouteMiddleware((context) => {
    context.locals.starlightRoute.siteTitleHref = "/docs/quickstart";
});
