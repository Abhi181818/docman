"use client";

import MagicBackground from "@/components/effects/magic-background";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Share, Share2Icon, FileText, Eye } from "lucide-react";

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [activeTab, setActiveTab] = useState("documents");
    const [selectedAccessDocId, setSelectedAccessDocId] = useState("");

    const [accessLogs, setAccessLogs] = useState([]);
    const [accessLoading, setAccessLoading] = useState(false);
    const [accessError, setAccessError] = useState("");

    const [selectedShareDocId, setSelectedShareDocId] = useState("");
    const [shareLogs, setShareLogs] = useState([]);
    const [shareLoading, setShareLoading] = useState(false);
    const [shareError, setShareError] = useState("");

    useEffect(() => {
        try {
            const saved = localStorage.getItem("authUser");
            const parsed = saved ? JSON.parse(saved) : null;
            setUser(parsed);
            if (parsed) fetchDocumentsForUser(parsed);
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        if (user?.token) fetchDocumentsForUser(user);
    }, [user?.token]);

    const fetchAccessLogsForDocument = async (documentId, u = user) => {
        if (!u?.token || !documentId) return;
        try {
            setAccessLoading(true);
            setAccessError("");
            const response = await api.get(`/api/document-access-logs/document/${encodeURIComponent(documentId)}`, {
                headers: { Authorization: `Bearer ${u.token}` },
            });
            const data = response?.data;
            const logs = Array.isArray(data) ? data : (data?.logs || data?.data || []);
            setAccessLogs(logs);
        } catch (err) {
            console.error("Failed to fetch access logs:", err);
            setAccessError(err?.response?.data?.message || err?.message || "Failed to fetch access logs");
        } finally {
            setAccessLoading(false);
        }
    };
    const fetchDocumentsForUser = async (u) => {
        if (!u?.token) return;
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/api/documents/getAllFile", {
                headers: { Authorization: `Bearer ${u.token}` },
            });
            const data = response?.data;
            const docs = Array.isArray(data) ? data : (data?.documents || data?.data || []);
            setDocuments(docs);
        } catch (err) {
            console.error("Failed to fetch documents:", err);
            setError(err?.response?.data?.message || err?.message || "Failed to fetch documents");
        } finally {
            setLoading(false);
        }
    };

    const fetchShareLogsForDocument = async (documentId, u = user) => {
        if (!u?.token || !documentId) return;
        try {
            setShareLoading(true);
            setShareError("");
            const response = await api.get(`/api/document-shares/document/${encodeURIComponent(documentId)}`, {
                headers: { Authorization: `Bearer ${u.token}` },
            });
            const data = response?.data;
            const logs = Array.isArray(data) ? data : (data?.logs || data?.data || []);
            setShareLogs(logs);
        } catch (err) {
            console.error("Failed to fetch share logs:", err);
            setShareError(err?.response?.data?.message || err?.message || "Failed to fetch share logs");
        } finally {
            setShareLoading(false);
        }
    };
    useEffect(() => {
        if (!user?.token) return;
        if (activeTab === "access" && selectedAccessDocId && !accessLoading) {
            fetchAccessLogsForDocument(selectedAccessDocId, user);
        }
        if (activeTab === "shares" && selectedShareDocId && !shareLoading) {
            fetchShareLogsForDocument(selectedShareDocId, user);
        }
    }, [activeTab, user?.token, selectedAccessDocId, selectedShareDocId]);

    const handleDownloadSharableDocument = async (doc) => {

        const formData = new FormData();
        formData.append('trackingId', doc.trackingId);
        await api.post("/api/document-shares/embed-tracker", formData, {
            headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            const blob = new Blob([response.data], { type: response.data.type });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = doc.originalFileName || 'document';
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    }

    return (
        <div className="relative">
            <MagicBackground />
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-semibold">Dashboard</h1>
                {!user ? (
                    <div className="mt-4 text-muted-foreground">
                        You're not signed in. <Button asChild variant="link"><Link href="/login">Sign in</Link></Button>
                    </div>
                ) : (
                    <div className="mt-4">
                        {/* Tabs header */}
                        <div className="inline-flex rounded-lg border bg-background p-1 shadow-sm">
                            <button
                                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${activeTab === "documents" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                                onClick={() => setActiveTab("documents")}
                                aria-current={activeTab === "documents" ? "page" : undefined}
                            >
                                <FileText size={16} /> Documents
                            </button>
                            <button
                                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${activeTab === "access" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                                onClick={() => setActiveTab("access")}
                                aria-current={activeTab === "access" ? "page" : undefined}
                            >
                                <Eye size={16} /> Access Logs
                            </button>
                            <button
                                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${activeTab === "shares" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                                onClick={() => setActiveTab("shares")}
                                aria-current={activeTab === "shares" ? "page" : undefined}
                            >
                                <Share2Icon size={16} /> Share Logs
                            </button>
                        </div>

                        {/* Tab panels */}
                        <div className="mt-6">
                            {activeTab === "documents" && (
                                <div>
                                    {loading && (
                                        <p className="text-sm text-muted-foreground">Loading documents…</p>
                                    )}
                                    {error && (
                                        <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</div>
                                    )}
                                    {!loading && !error && (
                                        <>
                                            {documents.length === 0 ? (
                                                <p className="mt-4 text-muted-foreground">No documents found.</p>
                                            ) : (
                                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                    {documents.map((doc) => (
                                                        <div key={doc.id} className="rounded-md border bg-card/80 p-4 shadow-sm backdrop-blur">
                                                            <h2 className="font-medium line-clamp-1">{doc.originalFileName || doc.fileName || "Untitled"}</h2>
                                                            <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                                                                {doc.size && <div>Size: {doc.size}</div>}
                                                                {doc.updatedAt && <div>Updated: {new Date(doc.updatedAt).toLocaleString()}</div>}
                                                            </div>
                                                            <div className="mt-3 flex items-center gap-2">
                                                                <Button size="sm" variant="secondary" onClick={() => handleDownloadSharableDocument(doc)} className="inline-flex items-center gap-1">
                                                                    <Share2Icon size={16} /> Get Sharable
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {activeTab === "access" && (
                                <div>
                                    <div className="mb-4 flex items-center gap-3">
                                        <label className="text-sm text-muted-foreground">Select document:</label>
                                        <select
                                            className="rounded-md border bg-background px-3 py-2 text-sm"
                                            value={selectedAccessDocId}
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                setSelectedAccessDocId(id);
                                                if (id) {
                                                    fetchAccessLogsForDocument(id);
                                                } else {
                                                    setAccessLogs([]);
                                                }
                                            }}
                                        >
                                            <option value="">-- choose --</option>
                                            {documents.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    {d.originalFileName || d.fileName || d.id}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {accessLoading && (
                                        <p className="text-sm text-muted-foreground">Loading access logs…</p>
                                    )}
                                    {accessError && (
                                        <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{accessError}</div>
                                    )}
                                    {!accessLoading && !accessError && (
                                        !selectedAccessDocId ? (
                                            <p className="text-sm text-muted-foreground">Choose a document to view access logs.</p>
                                        ) : accessLogs.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No access logs found for the selected document.</p>
                                        ) : (
                                            <div className="mt-2 divide-y rounded-md border bg-card/80">
                                                {accessLogs.map((log, i) => (
                                                    <div key={log.id || i} className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="font-medium flex items-center gap-2"><Eye size={16} /> {log.documentName || log.fileName || "Document"}</div>
                                                            <div className="text-xs text-muted-foreground">{log.accessedAt ? new Date(log.accessedAt).toLocaleString() : (log.createdAt ? new Date(log.createdAt).toLocaleString() : "")}</div>
                                                        </div>
                                                        <div className="mt-1 text-xs text-muted-foreground">
                                                            {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                                                            {log.userAgent && <span className="ml-3">Agent: {log.userAgent}</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {activeTab === "shares" && (
                                <div>
                                    <div className="mb-4 flex items-center gap-3">
                                        <label className="text-sm text-muted-foreground">Select document:</label>
                                        <select
                                            className="rounded-md border bg-background px-3 py-2 text-sm"
                                            value={selectedShareDocId}
                                            onChange={(e) => {
                                                const id = e.target.value;
                                                setSelectedShareDocId(id);
                                                if (id) {
                                                    fetchShareLogsForDocument(id);
                                                } else {
                                                    setShareLogs([]);
                                                }
                                            }}
                                        >
                                            <option value="">-- choose --</option>
                                            {documents.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    {d.originalFileName || d.fileName || d.id}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {shareLoading && (
                                        <p className="text-sm text-muted-foreground">Loading share logs…</p>
                                    )}
                                    {shareError && (
                                        <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{shareError}</div>
                                    )}
                                    {!shareLoading && !shareError && (
                                        !selectedShareDocId ? (
                                            <p className="text-sm text-muted-foreground">Choose a document to view share logs.</p>
                                        ) : shareLogs.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No share logs found for the selected document.</p>
                                        ) : (
                                            <div className="mt-2 divide-y rounded-md border bg-card/80">
                                                {shareLogs.map((log, i) => (
                                                    <div key={log.id || i} className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="font-medium flex items-center gap-2"><Share2Icon size={16} /> {log.documentName || log.fileName || "Document"}</div>
                                                            <div className="text-xs text-muted-foreground">{log.sharedAt ? new Date(log.sharedAt).toLocaleString() : (log.createdAt ? new Date(log.createdAt).toLocaleString() : "")}</div>
                                                        </div>
                                                        <div className="mt-1 text-xs text-muted-foreground">
                                                            {log.recipient && <span>To: {log.recipient}</span>}
                                                            {log.channel && <span className="ml-3">Via: {log.channel}</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
