import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title:
          "Fix-Konditori – Fika, smörgås & hembakat i Söderköping",
      },
      {
        name: "description",
        content:
          "Välkommen till Fix-Konditori vid Fixpunkten i Söderköping. Hembakat, smörgåsar, fika och kaffe i en mysig miljö.",
      },
      { property: "og:title", content: "Fix-Konditori – Fika & hembakat i Söderköping" },
      {
        property: "og:description",
        content:
          "Hembakat, smörgåsar och kaffe i en mysig miljö mitt i Söderköping.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center bg-cream">
      <p className="text-lg text-coffee">Sidan hittades inte</p>
    </div>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
