// DO NOT EDIT. This file is generated by deco.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import { DecoManifest } from "$live/types.ts";
import * as $$$$0 from "./routes/_middleware.ts";
import * as $$$$1 from "./routes/live/invoke/index.ts";
import * as $$$$2 from "./routes/live/editorData.ts";
import * as $$$$3 from "./routes/live/inspect.ts";
import * as $$$$4 from "./routes/live/workbench.ts";
import * as $$$$5 from "./routes/live/previews/[...block].tsx";
import * as $$$$6 from "./routes/live/_meta.ts";
import * as $$$$7 from "./routes/[...catchall].tsx";
import * as $$$$$$0 from "./handlers/routesSelection.ts";
import * as $$$$$$1 from "./handlers/router.ts";
import * as $$$$$$2 from "./handlers/devPage.ts";
import * as $$$$$$3 from "./handlers/fresh.ts";
import * as $$$$$$$0 from "./pages/LivePage.tsx";
import * as $$$$$$$$0 from "./sections/UseSlot.tsx";
import * as $$$$$$$$1 from "./sections/Slot.tsx";
import * as $$$$$$$$2 from "./sections/PageInclude.tsx";
import * as $$$$$$$$$0 from "./matchers/MatchDate.ts";
import * as $$$$$$$$$1 from "./matchers/MatchUserAgent.ts";
import * as $$$$$$$$$2 from "./matchers/MatchSite.ts";
import * as $$$$$$$$$3 from "./matchers/MatchMulti.ts";
import * as $$$$$$$$$4 from "./matchers/MatchRandom.ts";
import * as $$$$$$$$$5 from "./matchers/MatchEnvironment.ts";
import * as $$$$$$$$$6 from "./matchers/MatchAlways.ts";
import * as $$$$$$$$$$0 from "./flags/audience.ts";
import * as $$$$$$$$$$1 from "./flags/everyone.ts";
import * as $live_catchall from "$live/routes/[...catchall].tsx";

const manifest = {
  "routes": {
    "./routes/_middleware.ts": $$$$0,
    "./routes/[...catchall].tsx": $$$$7,
    "./routes/index.tsx": $live_catchall,
    "./routes/live/_meta.ts": $$$$6,
    "./routes/live/editorData.ts": $$$$2,
    "./routes/live/inspect.ts": $$$$3,
    "./routes/live/invoke/index.ts": $$$$1,
    "./routes/live/previews/[...block].tsx": $$$$5,
    "./routes/live/workbench.ts": $$$$4,
  },
  "handlers": {
    "$live/handlers/devPage.ts": $$$$$$2,
    "$live/handlers/fresh.ts": $$$$$$3,
    "$live/handlers/router.ts": $$$$$$1,
    "$live/handlers/routesSelection.ts": $$$$$$0,
  },
  "pages": {
    "$live/pages/LivePage.tsx": $$$$$$$0,
  },
  "sections": {
    "$live/sections/PageInclude.tsx": $$$$$$$$2,
    "$live/sections/Slot.tsx": $$$$$$$$1,
    "$live/sections/UseSlot.tsx": $$$$$$$$0,
  },
  "matchers": {
    "$live/matchers/MatchAlways.ts": $$$$$$$$$6,
    "$live/matchers/MatchDate.ts": $$$$$$$$$0,
    "$live/matchers/MatchEnvironment.ts": $$$$$$$$$5,
    "$live/matchers/MatchMulti.ts": $$$$$$$$$3,
    "$live/matchers/MatchRandom.ts": $$$$$$$$$4,
    "$live/matchers/MatchSite.ts": $$$$$$$$$2,
    "$live/matchers/MatchUserAgent.ts": $$$$$$$$$1,
  },
  "flags": {
    "$live/flags/audience.ts": $$$$$$$$$$0,
    "$live/flags/everyone.ts": $$$$$$$$$$1,
  },
  "islands": {},
  "config": config,
  "baseUrl": import.meta.url,
};

export type Manifest = typeof manifest;

export default manifest satisfies DecoManifest;
