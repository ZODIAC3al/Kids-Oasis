"use client";

import { useState } from "react";
import { Shield, Lock, FileText, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const mockLogs = [
  { id: "1", action: "ACADEMY_VERIFIED", user: "Admin (admin@kidsoasis.com)", target: "Lighthouse Early Learning", ip: "197.45.12.80", timestamp: "2026-07-25 02:45:10", status: "SUCCESS" },
  { id: "2", action: "USER_ROLE_CHANGE", user: "Admin (admin@kidsoasis.com)", target: "Teacher Sara Ahmed", ip: "197.45.12.80", timestamp: "2026-07-25 01:12:05", status: "SUCCESS" },
  { id: "3", action: "FAILED_LOGIN_ATTEMPT", user: "Unknown User", target: "parent_test@gmail.com", ip: "41.233.90.14", timestamp: "2026-07-24 23:50:41", status: "FAILED" },
];

export default function SystemAuditLogsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <NavBar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
              System Audit Logs & Security
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Immutable audit trail of administrator events, security alerts, and system access.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-tertiary-container/20 px-3.5 py-1.5 text-xs font-bold text-tertiary">
            <Shield className="h-4 w-4" /> System Guard Active
          </div>
        </div>

        <div className="card-surface shadow-elevation-2 overflow-hidden border border-outline-variant">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-xs font-bold text-on-surface uppercase tracking-wider">
                <th className="p-4">Action Event</th>
                <th className="p-4">Initiated By</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-xs">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low transition">
                  <td className="p-4 font-mono font-bold text-primary">{log.action}</td>
                  <td className="p-4 font-medium text-on-surface">{log.user}</td>
                  <td className="p-4 text-on-surface-variant">{log.target}</td>
                  <td className="p-4 font-mono text-on-surface-variant">{log.ip}</td>
                  <td className="p-4 text-on-surface-variant">{log.timestamp}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        log.status === "SUCCESS"
                          ? "bg-tertiary-container/20 text-tertiary"
                          : "bg-error-container/40 text-error"
                      }`}
                    >
                      {log.status === "SUCCESS" ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
