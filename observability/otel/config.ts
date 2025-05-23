import * as log from "@std/log";
import { Logger } from "@std/log/logger";
import { Context, context } from "../../deco.ts";
import denoJSON from "../../deno.json" with { type: "json" };
import {
  BatchSpanProcessor,
  FetchInstrumentation,
  NodeTracerProvider,
  opentelemetry,
  OTLPTraceExporter,
  ParentBasedSampler,
  registerInstrumentations,
  Resource,
  SemanticResourceAttributes,
} from "../../deps.ts";
import { DenoRuntimeInstrumentation } from "./instrumentation/deno-runtime.ts";
import { DebugSampler } from "./samplers/debug.ts";
import { type SamplingOptions, URLBasedSampler } from "./samplers/urlBased.ts";

import { ENV_SITE_NAME } from "../../engine/decofile/constants.ts";
import { safeImportResolve } from "../../engine/importmap/builder.ts";
import { OpenTelemetryHandler } from "./logger.ts";

const tryGetVersionOf = (pkg: string) => {
  try {
    const [_, ver] = safeImportResolve(pkg).split("@");
    return ver.substring(0, ver.length - 1);
  } catch {
    return undefined;
  }
};
const apps_ver = tryGetVersionOf("apps/") ??
  tryGetVersionOf("deco-sites/std/") ?? "_";

export const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: Deno.env.get(ENV_SITE_NAME) ??
      "deco",
    [SemanticResourceAttributes.SERVICE_VERSION]:
      Context.active().deploymentId ??
        Deno.hostname(),
    [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: crypto.randomUUID(),
    [SemanticResourceAttributes.CLOUD_PROVIDER]: context.platform,
    "deco.runtime.version": denoJSON.version,
    "deco.apps.version": apps_ver,
    [SemanticResourceAttributes.CLOUD_REGION]: Deno.env.get("DENO_REGION") ??
      "unknown",
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: Deno.env.get(
        "DECO_ENV_NAME",
      )
      ? `env-${Deno.env.get("DECO_ENV_NAME")}`
      : "production",
  }),
);

const loggerName = "deco-logger";
export const OTEL_IS_ENABLED: boolean = Deno.env.has(
  "OTEL_EXPORTER_OTLP_ENDPOINT",
);
export const logger: Logger = new Logger(loggerName, "INFO", {
  handlers: [
    ...OTEL_IS_ENABLED
      ? [
        new OpenTelemetryHandler("INFO", {
          resourceAttributes: resource.attributes,
        }),
      ]
      : [new log.ConsoleHandler("INFO")],
  ],
});

const trackCfHeaders = [
  "Cf-Ray",
  "Cf-Cache-Status",
  "X-Origin-Cf-Cache-Status",
  "X-Vtex-Io-Cluster-Id",
  "X-Edge-Cache-Status",
];

registerInstrumentations({
  instrumentations: [
    // @ts-ignore: no idea why this is failing, but it should work
    new FetchInstrumentation(
      {
        applyCustomAttributesOnSpan: (
          span,
          _req,
          response,
        ) => {
          if (span && response instanceof Response) {
            trackCfHeaders.forEach((header) => {
              const val = response.headers.get(header);
              if (val) {
                span.setAttribute(
                  `http.response.header.${header.toLocaleLowerCase()}`,
                  val,
                );
              }
            });
          }
        },
      },
    ),
    new DenoRuntimeInstrumentation(),
  ],
});

try {
  // Monkeypatching to get past FetchInstrumentation's dependence on sdk-trace-web, which has runtime dependencies on some browser-only constructs. See https://github.com/open-telemetry/opentelemetry-js/issues/3413#issuecomment-1496834689 for more details
  // Specifically for this line - https://github.com/open-telemetry/opentelemetry-js/blob/main/packages/opentelemetry-sdk-trace-web/src/utils.ts#L310
  // @ts-ignore: monkey patching location
  globalThis.location = {};
  // deno-lint-ignore no-empty
} catch {}
const parseSamplingOptions = (): SamplingOptions | undefined => {
  const encodedOpts = Deno.env.get("OTEL_SAMPLING_CONFIG");
  if (!encodedOpts) {
    return undefined;
  }
  try {
    return JSON.parse(atob(encodedOpts));
  } catch (err) {
    console.error("could not parse sampling config", err);
    return undefined;
  }
};

const debugSampler = new DebugSampler(
  new URLBasedSampler(parseSamplingOptions()),
);
const provider = new NodeTracerProvider({
  resource: resource,
  sampler: new ParentBasedSampler(
    {
      root: debugSampler,
    },
  ),
});

if (OTEL_IS_ENABLED) {
  const traceExporter = new OTLPTraceExporter();
  // @ts-ignore: no idea why this is failing, but it should work
  provider.addSpanProcessor(new BatchSpanProcessor(traceExporter));

  provider.register();
}

export const tracer = opentelemetry.trace.getTracer(
  "deco-tracer",
);

export const tracerIsRecording = () =>
  opentelemetry.trace.getActiveSpan()?.isRecording() ?? false;
