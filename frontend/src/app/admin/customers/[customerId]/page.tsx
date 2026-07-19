"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, FileText, Mail, MessageSquare } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { adminMessageService } from "@/services/adminMessage.service";
import { EmailComposeModal } from "@/components/admin/EmailComposeModal";
import { toast } from "react-toastify";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE:            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    SUSPENDED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200",
    COMPLETED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200",
    IN_PROGRESS:       "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200",
    ASSIGNED:          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200",
    SUBMITTED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200",
    REVISION_REQUESTED:"inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    OPEN:              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    PENDING:           "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200",
    CANCELLED:         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200",
    INCOMPLETE:        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200",
  };
  return <span className={map[status] || map.INCOMPLETE}>{status.replace(/_/g, " ")}</span>;
}

export default function CustomerDetailPage() {
  const { customerId }            = useParams<{ customerId: string }>();
  const router                    = useRouter();
  const [customer, setCustomer]   = useState<any>(null);
  const [tasks, setTasks]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [actioning, setActioning] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [messaging, setMessaging] = useState(false);

  const load = () =>
    Promise.all([adminService.getAllCustomers(), adminService.getCustomerTasks(Number(customerId))])
      .then(([cRes, tRes]) => {
        setCustomer((cRes.results || []).find((c: any) => c.id === Number(customerId)) || null);
        setTasks(tRes.results || []);
      }).catch(console.error).finally(() => setLoading(false));

  useEffect(() => { load(); }, [customerId]);

  const toggleSuspend = async () => {
    if (!customer) return;
    setActioning(true);
    try {
      if (customer.status === "SUSPENDED") await adminService.activateUser(customer.id);
      else await adminService.suspendUser(customer.id);
      toast.success(customer.status === "SUSPENDED" ? "Customer activated." : "Customer suspended.");
      load();
    } catch { toast.error("Failed to update customer status."); }
    finally { setActioning(false); }
  };

  const openConversation = async () => {
    if (!customer) return;
    setMessaging(true);
    try {
      const res = await adminMessageService.getOrCreateConversationForUser(customer.id) as any;
      router.push(`/admin/messages/${res.results.id}`);
    } catch { toast.error("Failed to open conversation."); }
    finally { setMessaging(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh] gap-3">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  );

  if (!customer) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Customer not found.</p>
      <Link href="/admin/customers" className="text-primary hover:underline text-sm mt-2 block">← Back</Link>
    </div>
  );

  return (
    <div className="space-y-5 pb-10">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" /> Customers
      </Link>

      {/* Profile header */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="size-14 rounded-full bg-blue-100 text-blue-700 text-lg font-semibold flex items-center justify-center flex-shrink-0">
            {(customer.first_name?.[0] || "") + (customer.last_name?.[0] || "")}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-foreground">{customer.first_name} {customer.last_name}</h1>
              <StatusBadge status={customer.status} />
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Mail className="size-3.5" />{customer.email}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground flex-shrink-0 space-y-2">
            <div>
              <p>Joined {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "—"}</p>
              <p className="font-semibold text-foreground mt-1">{tasks.length} tasks</p>
            </div>
            <div className="flex items-center justify-end gap-1.5">
              <button onClick={() => setShowEmailModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted/50 transition-colors">
                <Mail className="size-3.5" /> Email
              </button>
              <button disabled={messaging} onClick={openConversation}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50">
                {messaging ? <Loader2 className="size-3.5 animate-spin" /> : <MessageSquare className="size-3.5" />} Message
              </button>
              <button disabled={actioning} onClick={toggleSuspend}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors disabled:opacity-40 ${customer.status === "SUSPENDED" ? "text-green-700 bg-green-50 border-green-200 hover:bg-green-100" : "text-red-600 bg-red-50 border-red-200 hover:bg-red-100"}`}>
                {customer.status === "SUSPENDED" ? "Activate" : "Suspend"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEmailModal && (
        <EmailComposeModal
          userId={customer.id}
          userName={`${customer.first_name} ${customer.last_name}`}
          userEmail={customer.email}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      {/* Tasks */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Tasks ({tasks.length})</h2>
        </div>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="size-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No tasks yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Task</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Writer</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Budget</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t: any) => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-foreground truncate max-w-[220px]">
                      <Link href={`/admin/tasks/${t.id}`} className="hover:text-primary transition-colors">{t.title}</Link>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={t.task_status} /></td>
                    <td className="px-5 py-3.5 text-muted-foreground">{t.writer_name || "Unassigned"}</td>
                    <td className="px-5 py-3.5 font-medium">{t.budget != null ? `$${t.budget.toFixed(2)}` : "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
