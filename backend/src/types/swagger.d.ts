declare module "swagger-jsdoc" {
  type SwaggerDefinition = Record<string, unknown>;

  type SwaggerJsdocOptions = {
    definition: SwaggerDefinition;
    apis: string[];
  };

  function swaggerJsdoc(options: SwaggerJsdocOptions): SwaggerDefinition;

  export = swaggerJsdoc;
}

declare module "swagger-ui-express" {
  import type { RequestHandler } from "express";

  type SwaggerUiOptions = {
    customSiteTitle?: string;
    customCss?: string;
    swaggerOptions?: Record<string, unknown>;
  };

  export const serve: RequestHandler[];
  export function setup(
    swaggerDocument: Record<string, unknown>,
    explorer?: boolean,
    options?: SwaggerUiOptions
  ): RequestHandler;
}
