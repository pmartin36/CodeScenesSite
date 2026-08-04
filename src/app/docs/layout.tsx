import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NotifyProvider } from "@/components/NotifyProvider";
import { GetPluginProvider } from "@/components/GetPluginProvider";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { types } from "@/lib/api";

const NAV_TYPES = types.map((type) => ({
  id: type.id,
  displayName: type.displayName,
  members: type.members.map((member) => ({ id: member.id, name: member.name })),
}));

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotifyProvider>
      <GetPluginProvider>
        <Header />
        <div className="docs-shell container">
          <aside className="docs-sidebar">
            <DocsSidebar types={NAV_TYPES} />
          </aside>
          <div className="docs-body">{children}</div>
        </div>
        <Footer />
      </GetPluginProvider>
    </NotifyProvider>
  );
}
