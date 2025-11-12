"use client";

import MagicBackground from "@/components/effects/magic-background";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Share, Share2Icon, FileText, Eye, TrashIcon, DownloadIcon, File } from "lucide-react";
import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // upload state
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState("");

    const [activeTab, setActiveTab] = useState("documents");
    const [selectedAccessDocId, setSelectedAccessDocId] = useState("");

    const [accessLogs, setAccessLogs] = useState([]);
    const [accessLoading, setAccessLoading] = useState(false);
    const [accessError, setAccessError] = useState("");

    const [selectedShareDocId, setSelectedShareDocId] = useState("");
    const [shareLogs, setShareLogs] = useState([]);
    const [shareLoading, setShareLoading] = useState(false);
    const [shareError, setShareError] = useState("");
    const [ascDesc, setAscDesc] = useState("asc");

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
            const data = response?.data
            const logs = Array.isArray(data) ? data : []

            // logs.sort((a, b) => new Date(b.accessedAt) - new Date(a.accessedAt));

            // console.log("Fetched access logs:", data);
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

    const handleClickUpload = () => {
        setUploadError("");
        setUploadSuccess("");
        fileInputRef.current?.click();
    };

    const handleFileSelected = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user?.token) return;
        setUploadError("");
        setUploadSuccess("");
        const formData = new FormData();
        formData.append("file", file, file.name);
        try {
            setUploading(true);
            setUploadProgress(0);
            await api.post("/api/documents/upload", formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "multipart/form-data",
                },
                maxBodyLength: Infinity,
                onUploadProgress: (evt) => {
                    if (!evt.total) return;
                    const pct = Math.round((evt.loaded * 100) / evt.total);
                    setUploadProgress(pct);
                },
            });
            setUploadSuccess("Uploaded successfully");
            await fetchDocumentsForUser(user);
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadError(err?.response?.data?.message || err?.message || "Upload failed");
        } finally {
            setUploading(false);
            setTimeout(() => {
                setUploadSuccess("");
                setUploadProgress(0);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }, 1500);
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
            responseType: 'blob',
        }).then(async response => {
            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            console.log("blob", blob);
            console.log("response", response);
            console.log("type", response.headers["content-type"])
            const url = window.URL.createObjectURL(blob);
            console.log("URL:", url);
            console.log("name:", doc.originalFileName);
            const link = document.createElement('a');
            link.href = url;
            link.download = doc.originalFileName || 'document';
            document.body.appendChild(link);
            link.click();
            link.remove();
        });

        // api.get(`/api/documents/getFile/${encodeURIComponent(doc.fileName)}`, {
        //     headers: {
        //         Authorization: `Bearer ${user.token}`,
        //     },
        //     responseType: 'blob',
        // }).then(async response => {
        //     const blob = new Blob([response.data], { type: "application/pdf" });
        //     // embedding in pdf
        //     // console.log("blob", blob.arrayBuffer());
        //     const bytes = await blob.arrayBuffer();
        //     console.log("bytes", bytes);
        //     const pdfDoc = await new PDFDocument.load(bytes);
        //     // pdfDoc add transparent image 
        //     const url = "https://maper.info/1jK205.jpg";

        //     // const pages = pdfDoc.getPages();
        //     // console.log("pages", pages)
        //     const pages = pdfDoc.getPages();

        //     const pngImageBytes = await fetch(url).then(res => res.arrayBuffer());
        //     const pngImage = await pdfDoc.embedPng(pngImageBytes);
        //     const pngDims = pngImage.scale(0.1);
        //     //
        //     pages.forEach((page) => {
        //         const { width, height } = page.getSize();
        //         page.drawImage(pngImage, {
        //             x: width - pngDims.width - 10,
        //             y: 10,
        //             width: pngDims.width,
        //             height: pngDims.height,
        //             opacity: 0.1,
        //         })
        //     });

        //     pdfDoc.save().then((modifiedPdfBytes) => {
        //         const modifiedBlob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
        //         const url = window.URL.createObjectURL(modifiedBlob);
        //         const link = document.createElement('a');
        //         link.href = url;
        //         link.download = doc.originalFileName || 'document.pdf';
        //         document.body.appendChild(link);
        //         link.click();
        //         link.remove();
        //     });

        // })
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
                                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="text-sm text-muted-foreground">
                                            Manage your files and create shareable, trackable links.
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />
                                            <Button size="sm" onClick={handleClickUpload} disabled={!user?.token || uploading}>
                                                {uploading ? `Uploading… ${uploadProgress || 0}%` : "Upload document"}
                                            </Button>
                                        </div>
                                    </div>
                                    {uploadError && (
                                        <div className="mb-3 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">{uploadError}</div>
                                    )}
                                    {uploadSuccess && (
                                        <div className="mb-3 rounded-md border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">{uploadSuccess}</div>
                                    )}
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
                                                        <div key={doc.id} className="rounded-md border bg-card/80 p-4 shadow-sm backdrop-blur hover:shadow-lg transition-shadow">
                                                            <h2 className="font-medium line-clamp-1">{doc.originalFileName || "Untitled"}</h2>

                                                            {doc.fileName.endsWith(".pdf") ?
                                                                (<div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                                                                    <span>PDF Document</span>
                                                                </div>)
                                                                : (
                                                                    <></>
                                                                )
                                                            }
                                                            <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                                                                {doc.size && <div>Size: {doc.size}</div>}
                                                                {doc.updatedAt && <div>Updated: {new Date(doc.updatedAt).toLocaleString()}</div>}
                                                            </div>
                                                            <div className="mt-3 flex items-center gap-2">
                                                                <Button size="sm" variant="secondary" onClick={() => handleDownloadSharableDocument(doc)} className="inline-flex items-center gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary">
                                                                    <DownloadIcon size={16} /> Get Sharable
                                                                </Button>
                                                                <Button size="sm" variant="inline" onClick={() => handleDownloadSharableDocument(doc)} className="inline-flex items-center gap-1 hover:bg-red-100 hover:text-red-600 hover:border-red-600">
                                                                    <TrashIcon size={16} />
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
                                        <button onClick={() => handleSortLogs()}></button>
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
                                            <div className="mt-2 rounded-md border bg-card/80">
                                                {accessLogs.map((log, i) => (
                                                    <div key={log.id || i} className="p-4">
                                                        <div className="flex items-center ">
                                                            <div className="font-medium flex items-center gap-2"><Eye size={16} /> {"Viewed on  "}</div>
                                                            <div className="text-xs text-muted-foreground">{log.accessedAt ? new Date(log.accessedAt).toLocaleString() : (log.createdAt ? new Date(log.createdAt).toLocaleString() : "")}</div>
                                                        </div>
                                                        <div className="mt-1 text-xs text-muted-foreground">
                                                            <span className="font-bold">{"Viewer IP"}</span> <span>{log.viewerIp}</span>
                                                            <br />
                                                            {log.userAgent && <span>Agent: {log.userAgent}</span>}
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
