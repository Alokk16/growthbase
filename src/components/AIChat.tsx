import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Upload, FileSpreadsheet, Download, X, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  context?: any;
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  hasExcelData?: boolean;
}

interface SheetData {
  sheetName: string;
  rows: any[];
  headers: string[];
}

interface UploadedFile {
  name: string;
  sheets: SheetData[];
  totalRows: number;
}

const AVAILABLE_TOOLS = [
  "Break-even Calculator", "ROI Calculator", "Burn Rate Tracker", "Runway Estimator",
  "Monthly Profit Estimator", "Cash Flow Visualizer", "Funding Dilution Simulator",
  "CLTV Calculator", "Unit Economics Visualizer", "Working Capital Estimator",
  "Revenue Forecast Simulator", "Pricing Strategy Planner", "Ad Spend ROI Estimator",
  "Lead-to-Customer Conversion", "SaaS MRR/ARR Estimator", "Funnel Drop-off Analyzer",
  "Referral Growth Projection", "Bundle vs A-la-Carte Optimizer", "Hourly Rate Estimator",
  "Scope Creep Cost Estimator", "Value-Based Pricing Planner", "OKR Tracker",
  "Business Goal Tracker", "GST Impact Calculator"
];

const AIChat = ({ isOpen, onClose, context }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [lastAiResponse, setLastAiResponse] = useState<string>("");
  const [selectedTool, setSelectedTool] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const isExcel = validTypes.includes(file.type) || file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

    if (!isExcel) {
      toast.error("Only Excel files (.xlsx, .xls) are allowed!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawData = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(rawData, { type: "array" });
        
        const sheets: SheetData[] = [];
        let totalRows = 0;
        
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          if (jsonData.length > 0) {
            const headers = Object.keys(jsonData[0] as object);
            sheets.push({
              sheetName,
              rows: jsonData as any[],
              headers,
            });
            totalRows += jsonData.length;
          }
        });

        setUploadedFile({ name: file.name, sheets, totalRows });
        toast.success(`Uploaded: ${file.name} (${sheets.length} sheets, ${totalRows} rows)`);
      } catch {
        toast.error("Failed to parse Excel file.");
      }
    };
    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const cleanMarkdown = (text: string): string => {
    return text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`{1,3}[^`]*`{1,3}/g, (m) => m.replace(/`/g, ""))
      .replace(/^[-*•]\s*/gm, "")
      .replace(/^\d+\.\s*/gm, "")
      .replace(/^#{1,6}\s*/gm, "")
      .replace(/[📊📈📉🔍📐💡✅⚠️🔧📥💰🏦📋🎯🚀💎🔑📌🛡️]/g, "")
      .trim();
  };

  const stripEmojisFromHeader = (text: string): string => {
    return text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]/gu, "").trim();
  };

  const applySheetStyle = (ws: XLSX.WorkSheet, colWidths: number[], headerRow = true) => {
    ws["!cols"] = colWidths.map(w => ({ wch: w }));
    // xlsx community edition doesn't support cell styles, but we set column widths
  };

  const exportToExcel = () => {
    if (!lastAiResponse) {
      toast.error("No analysis to export yet.");
      return;
    }

    try {
      const wb = XLSX.utils.book_new();
      const lines = lastAiResponse.split("\n").filter((l) => l.trim() !== "");

      // Parse sections from AI response
      let currentSection = "Executive Summary";
      const sections: Record<string, string[]> = {};
      const metricsTable: string[][] = [];
      const riskTable: string[][] = [];
      const recommendations: { Action: string; Impact: string; Timeline: string }[] = [];
      let inTable = false;
      let currentTableTarget: "metrics" | "risk" | "other" = "other";
      let tableHeaders: string[] = [];

      for (const line of lines) {
        if (line.startsWith("## ") || line.startsWith("### ")) {
          currentSection = stripEmojisFromHeader(line.replace(/^#{1,3}\s*/, ""));
          inTable = false;
          if (!sections[currentSection]) sections[currentSection] = [];
          continue;
        }

        if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
          if (line.includes("---")) continue;
          const cells = line.split("|").filter(c => c.trim() !== "").map(c => cleanMarkdown(c));

          const sectionLower = currentSection.toLowerCase();
          if (sectionLower.includes("risk")) {
            currentTableTarget = "risk";
          } else if (sectionLower.includes("metric") || sectionLower.includes("key") || sectionLower.includes("financial")) {
            currentTableTarget = "metrics";
          }

          if (!inTable) {
            inTable = true;
            tableHeaders = cells;
            if (currentTableTarget === "metrics") metricsTable.push(cells);
            else if (currentTableTarget === "risk") riskTable.push(cells);
          } else {
            if (currentTableTarget === "metrics") metricsTable.push(cells);
            else if (currentTableTarget === "risk") riskTable.push(cells);

            if (currentTableTarget === "risk" || sectionLower.includes("recommend")) {
              // Try to parse recommendations
              if (cells.length >= 3 && sectionLower.includes("recommend")) {
                recommendations.push({ Action: cells[0], Impact: cells[1], Timeline: cells[2] });
              }
            }
          }
          continue;
        }

        inTable = false;
        currentTableTarget = "other";
        const cleaned = cleanMarkdown(line);
        if (cleaned) {
          if (!sections[currentSection]) sections[currentSection] = [];
          sections[currentSection].push(cleaned);
        }
      }

      // Extract recommendations from sections if not found in tables
      const recoSectionKey = Object.keys(sections).find(k => k.toLowerCase().includes("recommend"));
      if (recommendations.length === 0 && recoSectionKey) {
        sections[recoSectionKey]?.forEach(line => {
          recommendations.push({ Action: line, Impact: "", Timeline: "" });
        });
      }

      // Sheet 1: Executive Summary
      const execSummaryKey = Object.keys(sections).find(k =>
        k.toLowerCase().includes("executive") || k.toLowerCase().includes("summary") || k === "Executive Summary"
      );
      const execContent = execSummaryKey
        ? sections[execSummaryKey].join("\n\n")
        : Object.values(sections).flat().slice(0, 5).join("\n\n");
      const ws1 = XLSX.utils.aoa_to_sheet([
        ["Executive Summary"],
        [""],
        [execContent || cleanMarkdown(lastAiResponse).slice(0, 2000)],
      ]);
      applySheetStyle(ws1, [120]);
      XLSX.utils.book_append_sheet(wb, ws1, "Executive Summary");

      // Sheet 2: Key Metrics
      if (metricsTable.length > 0) {
        const ws2 = XLSX.utils.aoa_to_sheet(metricsTable);
        applySheetStyle(ws2, metricsTable[0].map(() => 30));
        XLSX.utils.book_append_sheet(wb, ws2, "Key Metrics");
      } else {
        const ws2 = XLSX.utils.aoa_to_sheet([["Metric", "Value"], ["No structured metrics found", "See Analysis sheet"]]);
        applySheetStyle(ws2, [35, 35]);
        XLSX.utils.book_append_sheet(wb, ws2, "Key Metrics");
      }

      // Sheet 3: Analysis (section + content)
      const analysisRows: string[][] = [["Section", "Content"]];
      for (const [section, contentLines] of Object.entries(sections)) {
        if (section.toLowerCase().includes("executive") || section.toLowerCase().includes("recommend")) continue;
        for (const content of contentLines) {
          analysisRows.push([stripEmojisFromHeader(section), content]);
        }
      }
      if (analysisRows.length === 1) {
        analysisRows.push(["General", cleanMarkdown(lastAiResponse)]);
      }
      const ws3 = XLSX.utils.aoa_to_sheet(analysisRows);
      applySheetStyle(ws3, [30, 90]);
      XLSX.utils.book_append_sheet(wb, ws3, "Analysis");

      // Sheet 4: Risk Assessment
      if (riskTable.length > 0) {
        const ws4 = XLSX.utils.aoa_to_sheet(riskTable);
        applySheetStyle(ws4, riskTable[0].map(() => 30));
        XLSX.utils.book_append_sheet(wb, ws4, "Risk Assessment");
      } else {
        const riskKey = Object.keys(sections).find(k => k.toLowerCase().includes("risk"));
        const riskRows: string[][] = [["Risk", "Impact", "Mitigation"]];
        if (riskKey) {
          sections[riskKey].forEach(line => riskRows.push([line, "", ""]));
        } else {
          riskRows.push(["No risk data identified", "", ""]);
        }
        const ws4 = XLSX.utils.aoa_to_sheet(riskRows);
        applySheetStyle(ws4, [40, 30, 30]);
        XLSX.utils.book_append_sheet(wb, ws4, "Risk Assessment");
      }

      // Sheet 5: Recommendations
      const recoRows: string[][] = [["Action", "Impact", "Timeline"]];
      if (recommendations.length > 0) {
        recommendations.forEach(r => recoRows.push([r.Action, r.Impact, r.Timeline]));
      } else {
        recoRows.push(["No specific recommendations extracted", "", ""]);
      }
      const ws5 = XLSX.utils.aoa_to_sheet(recoRows);
      applySheetStyle(ws5, [50, 30, 20]);
      XLSX.utils.book_append_sheet(wb, ws5, "Recommendations");

      // Append original data if available
      if (uploadedFile) {
        const allRows = uploadedFile.sheets.flatMap(s => s.rows);
        const formattedData = allRows.map((row: any) => {
          const newRow: any = {};
          for (const [key, value] of Object.entries(row)) {
            const cleanKey = key.startsWith('__EMPTY') ? '' : key;
            const finalKey = cleanKey || `Column ${Object.keys(newRow).length + 1}`;
            if (typeof value === 'number' && Math.abs(value) >= 100) {
              newRow[finalKey] = `₹${value.toLocaleString('en-IN')}`;
            } else {
              newRow[finalKey] = value;
            }
          }
          return newRow;
        });
        const wsOrig = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(wb, wsOrig, "Original Data");
      }

      XLSX.writeFile(wb, `alok-analysis-${Date.now()}.xlsx`);
      toast.success("Analysis exported to Excel!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export. Please try again.");
    }
  };


  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const toolLabel = (selectedTool && selectedTool !== "none") ? selectedTool : null;
    const displayPrefix = [
      uploadedFile ? `📊 [${uploadedFile.name}]` : "",
      toolLabel ? `🔧 [${toolLabel}]` : "",
    ].filter(Boolean).join(" ");

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: displayPrefix ? `${displayPrefix}\n${inputValue}` : inputValue,
      timestamp: new Date(),
      hasExcelData: !!uploadedFile,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-excel", {
        body: {
          sheets: uploadedFile
  ? uploadedFile.sheets.slice(0, 50).map(s => ({
      sheetName: s.sheetName,
      rows: s.rows.slice(0, 200),
      headers: s.headers,
    }))
  : null,
          question: inputValue,
          toolName: toolLabel,
        },
      });

      if (error) throw error;

      const aiContent = data?.analysis || "Sorry, I couldn't generate a response.";
      setLastAiResponse(aiContent);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          content: aiContent,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      console.error("AI error:", err);
      const errorMsg = "⚠️ AI analysis failed. Please try again in a moment.";
      toast.error("AI analysis failed.");
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: 'ai', content: errorMsg, timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[750px] h-[85vh] max-h-[700px] flex flex-col glass-effect p-3 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text flex items-center">
            <Bot className="mr-2 h-6 w-6 text-primary" />
            Alok - Your AI Business Strategist
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 space-y-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center p-6 bg-white/5 rounded-lg">
                <Bot className="h-12 w-12 mx-auto mb-3 text-primary" />
                <p className="text-muted-foreground mb-3">
                  {context?.message ||
                    "Hi! I'm Alok, your AI business strategist. Upload your Excel data and ask me to analyze it with any tool!"}
                </p>
                <div className="text-xs text-muted-foreground/70 space-y-1">
                  <p>📊 Upload .xlsx files → Ask questions → Get step-by-step calculations</p>
                  <p>💡 Mention a tool name (e.g. "ROI Calculator") for specialized analysis</p>
                  <p>📥 Export the full analysis back to Excel</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-lg overflow-hidden ${
                    message.type === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-foreground'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {message.type === 'ai' && (
                      <Bot className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-5 w-5 mt-1 text-white flex-shrink-0" />
                    )}
                    <div className={`text-sm leading-relaxed max-w-none overflow-hidden break-words ${message.type === 'ai' ? 'ai-response-content' : ''}`}>
                      {message.type === 'ai' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h2: ({ children }) => <h2 className="text-base font-bold mt-4 mb-2 text-primary border-b border-primary/20 pb-1">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-semibold mt-3 mb-1.5 text-foreground">{children}</h3>,
                            p: ({ children }) => <p className="mb-2 text-foreground/90 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="mb-2 ml-4 space-y-1 list-disc text-foreground/85">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-2 ml-4 space-y-1 list-decimal text-foreground/85">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-2 rounded-md border border-border">
                                <table className="w-full text-xs border-collapse">{children}</table>
                              </div>
                            ),
                            thead: ({ children }) => <thead className="bg-primary/10">{children}</thead>,
                            th: ({ children }) => <th className="px-3 py-1.5 text-left font-semibold text-foreground border-b border-border">{children}</th>,
                            td: ({ children }) => <td className="px-3 py-1.5 text-foreground/80 border-b border-border/50">{children}</td>,
                            hr: () => <hr className="my-3 border-border/30" />,
                            code: ({ children, className }) => {
                              const isBlock = className?.includes('language-');
                              return isBlock
                                ? <pre className="bg-muted/50 rounded-md p-2 my-2 overflow-x-auto text-xs"><code>{children}</code></pre>
                                : <code className="bg-muted/50 px-1 py-0.5 rounded text-xs font-mono">{children}</code>;
                            },
                          }}
                        >{message.content}</ReactMarkdown>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-4 rounded-lg flex items-center space-x-3">
                  <Bot className="h-5 w-5 text-primary" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {uploadedFile ? "Analyzing your data with AI..." : "Thinking..."}
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Uploaded file & selected tool indicators */}
        {(uploadedFile || selectedTool) && (
          <div className="mx-4 flex flex-wrap gap-2">
            {uploadedFile && (
              <div className="px-3 py-2 bg-primary/10 rounded-lg flex items-center space-x-2 text-sm">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                <span className="text-foreground">{uploadedFile.name}</span>
                <span className="text-muted-foreground">({uploadedFile.totalRows} rows, {uploadedFile.sheets.length} sheets)</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setUploadedFile(null)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            {selectedTool && (
              <div className="px-3 py-2 bg-accent/30 rounded-lg flex items-center space-x-2 text-sm">
                <Wrench className="h-4 w-4 text-primary" />
                <span className="text-foreground">{selectedTool}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedTool("")}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Input area */}
        <div className="flex items-center space-x-2 p-4 border-t border-white/10">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            title="Upload Excel file"
          >
            <Upload className="h-4 w-4" />
          </Button>

          {/* Tool selector dropdown */}
          <Select value={selectedTool} onValueChange={setSelectedTool}>
            <SelectTrigger className="w-10 h-10 p-0 border-none bg-transparent hover:bg-accent [&>svg:last-child]:hidden" title="Select a tool">
              <Wrench className="h-4 w-4 mx-auto" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50 max-h-64">
              <SelectItem value="none" className="text-muted-foreground">No specific tool</SelectItem>
              {AVAILABLE_TOOLS.map((tool) => (
                <SelectItem key={tool} value={tool}>{tool}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {lastAiResponse && (
            <Button variant="ghost" size="icon" onClick={exportToExcel} title="Export analysis to Excel">
              <Download className="h-4 w-4" />
            </Button>
          )}

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              selectedTool
                ? `Ask about ${selectedTool}...`
                : uploadedFile
                ? "Ask about your data..."
                : "Ask me anything about startups, growth, funding..."
            }
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AIChat };
