import { Suspense } from "react";
import { AdminMessagesPanel } from "@/components/messages/AdminMessagesPanel";

export default function CustomerAdminMessagesPage() {
  return (
    <Suspense>
      <AdminMessagesPanel />
    </Suspense>
  );
}
