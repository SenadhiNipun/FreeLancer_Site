import { Suspense } from "react";
import { AdminMessagesPanel } from "@/components/messages/AdminMessagesPanel";

export default function WriterAdminMessagesPage() {
  return (
    <Suspense>
      <AdminMessagesPanel />
    </Suspense>
  );
}
