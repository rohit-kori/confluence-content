import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
// import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { getBaseLayoutOptions } from "../layout.config";

export default async function Layout({ children }: { children: ReactNode }) {
  const baseOptions = await getBaseLayoutOptions();
  return (
    <DocsLayout tree={source.pageTree} {...baseOptions}>
      {children}
    </DocsLayout>
  );
}
