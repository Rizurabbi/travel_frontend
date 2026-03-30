import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import "../styles/index.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "https://openskai.onrender.com";

const IndexDe = () => {
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage } = useChat();
  const { user, token, login } = useAuth();
  const { toast } = useToast();
  const [homeMessage, setHomeMessage] = useState("");

  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [supportAccessInfo, setSupportAccessInfo] = useState<any>(null);
  const [travelDates, setTravelDates] = useState({ startDate: "", endDate: "" });
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSupportChat, setShowSupportChat] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const checkSupportAccess = async () => {
    if (!user || !token) {
      setLoginModalOpen(true);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/support/access-status`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const supportData = data.support_access;
        setSupportAccessInfo(supportData);
        if (supportData?.has_access) {
          setShowSupportChat(true);
        } else {
          setSupportModalOpen(true);
        }
      } else {
        toast({ title: "Fehler", description: data.error || "Support-Zugang konnte nicht geprüft werden", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Fehler", description: error.message || "Support-Zugang konnte nicht geprüft werden", variant: "destructive" });
    }
  };

  const calculateDays = () => {
    if (travelDates.startDate && travelDates.endDate) {
      const start = new Date(travelDates.startDate);
      const end = new Date(travelDates.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (days > 0) setEstimatedCost(days);
    }
  };

  useEffect(() => { calculateDays(); }, [travelDates]);

  const handleSupportPayment = async () => {
    if (!user || !token) { setLoginModalOpen(true); return; }
    if (!travelDates.startDate || !travelDates.endDate) {
      toast({ title: "Fehler", description: "Bitte wählen Sie Ihre Reisedaten aus", variant: "destructive" });
      return;
    }
    setSupportModalOpen(false);
    navigate("/support-access", {
      state: {
        selectedDatePlan: {
          days: estimatedCost,
          amount: estimatedCost,
          startDate: travelDates.startDate,
          endDate: travelDates.endDate,
        },
      },
    });
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({ title: "Fehler", description: "Bitte geben Sie Ihre E-Mail und Ihr Passwort ein", variant: "destructive" });
      return;
    }
    setIsLoggingIn(true);
    try {
      await login(loginEmail, loginPassword);
      setLoginModalOpen(false);
      setSupportModalOpen(true);
      setLoginEmail("");
      setLoginPassword("");
    } catch (error: any) {
      toast({ title: "Fehler", description: error.message || "Anmeldung fehlgeschlagen", variant: "destructive" });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleHomeChatSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = homeMessage.trim();
    if (!trimmed || isLoading) return;
    await sendMessage(trimmed);
    setHomeMessage("");
  };

  const handleHomeChatKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); await handleHomeChatSubmit(); }
  };

  return (
    <Layout>
      <div className="openskai-container">
        {/* Logo-Bereich */}
        <div className="logo-section">
          <img src="/logoname.png" alt="OPENSKAI" className="openskai-name-image" />
        </div>

        {/* Service-Karten-Bereich */}
        <div className="services-section">
          {/* Reisebuchung */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="service-card">
                <img src="/Airplane_Icon.png" alt="Reisebuchung" className="service-icon" />
                <h3 className="service-title">REISE-<br />BUCHUNG</h3>
                <p className="service-description">Buchen Sie Flugtickets, Hotels, Reisepakete und mehr.</p>
                <button className="learn-more-btn">MEHR ERFAHREN...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                  Reisebuchung
                </DialogTitle>
                <p className="text-lg text-gray-700">
                  Buchen Sie Flugtickets, Hotels, Reisepakete und mehr.
                </p>
              </DialogHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="why" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Warum Reisebuchung?
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Wir glauben, dass Reisen mehr ist als das Besuchen neuer Orte – es geht darum, bedeutungsvolle
                      Erlebnisse zu schaffen. Unsere sorgfältig gestalteten Pakete verbinden Abenteuer, Komfort und
                      kulturelles Eintauchen, um Ihnen die Reise Ihres Lebens zu bieten. Von exotischen Stränden bis
                      hin zu Bergrefugien kümmern wir uns um jedes Detail, damit Sie sich auf das Schaffen von
                      Erinnerungen konzentrieren können.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="why-us" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Warum Wir?
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Mit über einem Jahrzehnt Erfahrung haben wir die Kunst perfektioniert, unvergessliche Reisen zu
                      gestalten. Unser Team wählt sorgfältig jeden Reiseziel und jede Aktivität aus, um Qualität und
                      Authentizität zu gewährleisten. Wir bieten 24/7-Support, flexible Buchungsoptionen und den besten
                      Wert für Ihr Geld.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>

          {/* Reiseversicherung */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="service-card">
                <img src="/Shield_Icon.png" alt="Reiseversicherung" className="service-icon" />
                <h3 className="service-title">REISE-<br />VERSICHERUNG</h3>
                <p className="service-description">Bleiben Sie auf Ihrer Reise geschützt</p>
                <button className="learn-more-btn">MEHR ERFAHREN...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                  Reiseversicherung
                </DialogTitle>
                <p className="text-lg text-gray-700">
                  Reisen Sie mit Vertrauen und wissen Sie, dass Sie gegen das Unerwartete geschützt sind
                </p>
              </DialogHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="why" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Warum eine Versicherung?
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Unsere umfassende Reiseversicherung schützt Sie vor medizinischen Notfällen, Reisestornierungen,
                      verlorenem Gepäck und mehr. Reisen Sie mit einem ruhigen Gewissen und wissen Sie, dass Sie
                      überall geschützt sind.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>

          {/* Reise-Banking */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="service-card">
                <img src="/Wallet_icon.png" alt="Reise-Banking" className="service-icon" />
                <h3 className="service-title">REISE-<br />BANKING</h3>
                <p className="service-description">Sichere Zahlungslösungen über Grenzen hinweg</p>
                <button className="learn-more-btn">MEHR ERFAHREN...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                  Reise-Banking
                </DialogTitle>
                <p className="text-lg text-gray-700">
                  Sichere, bequeme und flexible Zahlungslösungen für alle Ihre Reisebedürfnisse
                </p>
              </DialogHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="features" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Hauptmerkmale
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Mehrwährungsunterstützung, Wettbewerbsfähige Wechselkurse, Sichere Transaktionen, 24/7-Kundendienst
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>

          {/* Kundendienst */}
          <Dialog open={supportModalOpen} onOpenChange={setSupportModalOpen}>
            <DialogTrigger asChild>
              <div className="service-card" onClick={checkSupportAccess}>
                <img src="/Support_Icon.png" alt="Kundendienst" className="service-icon" />
                <h3 className="service-title">KUNDEN-<br />DIENST</h3>
                <p className="service-description">24/7 Unterstützung</p>
                <button className="learn-more-btn">MEHR ERFAHREN...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              {!showSupportChat ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                      24/7 Kundendienst
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: "#f0f4ff", borderLeft: "4px solid #2185FF" }}>
                      <h3 className="font-bold text-lg mb-3" style={{ color: "#001540" }}>
                        Über Unseren Support-Service
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Dieser Service steht allen Kunden zur Verfügung, die auf unserer Website eingekauft haben.
                        Wenn Sie noch nichts bei uns gekauft haben, wird eine Gebühr von <strong>1 $ pro Tag</strong> für die Nutzung unserer Support-Linie erhoben.
                      </p>
                      <p className="text-gray-700">
                        Wir benötigen Ihre genauen Reisedaten, um die Gesamtgebühr zu berechnen.
                        Sobald Sie Ihre Daten angegeben haben, zeigen wir Ihnen die Kosten an und verarbeiten Ihre Zahlung.
                      </p>
                    </div>

                    {!user ? (
                      <div className="text-center py-4">
                        <p className="mb-4 text-gray-700">Bitte melden Sie sich an, um auf den Support zuzugreifen</p>
                        <Button
                          onClick={() => { setSupportModalOpen(false); setLoginModalOpen(true); }}
                          style={{ backgroundColor: "#2185FF", color: "white", fontWeight: "600" }}
                        >
                          Anmelden oder Registrieren
                        </Button>
                      </div>
                    ) : supportAccessInfo?.has_access ? (
                      <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#e8f5e9" }}>
                        <p className="text-green-700 font-bold text-lg">
                          ✓ Sie haben Support-Zugang bis zum {new Date(supportAccessInfo.expires_at).toLocaleDateString()}
                        </p>
                        <Button
                          onClick={() => setShowSupportChat(true)}
                          className="mt-4"
                          style={{ backgroundColor: "#2185FF", color: "white", fontWeight: "600" }}
                        >
                          Chat Starten
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                            Reisebeginn *
                          </label>
                          <Input
                            type="date"
                            value={travelDates.startDate}
                            onChange={(e) => setTravelDates({ ...travelDates, startDate: e.target.value })}
                            style={{ borderColor: "#2185FF" }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                            Reiseende *
                          </label>
                          <Input
                            type="date"
                            value={travelDates.endDate}
                            onChange={(e) => setTravelDates({ ...travelDates, endDate: e.target.value })}
                            style={{ borderColor: "#2185FF" }}
                          />
                        </div>
                        {estimatedCost > 0 && (
                          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#fff3cd", borderLeft: "4px solid #FFF200" }}>
                            <p className="text-sm text-gray-700">Geschätzte Kosten</p>
                            <p className="text-3xl font-bold" style={{ color: "#2185FF" }}>
                              ${estimatedCost}.00
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {estimatedCost} Tag{estimatedCost !== 1 ? "e" : ""} × 1 $/Tag
                            </p>
                          </div>
                        )}
                        <Button
                          onClick={handleSupportPayment}
                          disabled={isProcessingPayment || estimatedCost === 0}
                          className="w-full"
                          style={{ backgroundColor: "#2185FF", color: "white", fontWeight: "600" }}
                        >
                          {isProcessingPayment ? "Wird verarbeitet..." : "Weiter zu Zahlungsplänen"}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold" style={{ color: "#2185FF" }}>
                      Live-Support-Chat
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="p-4 rounded-lg text-center mb-4" style={{ backgroundColor: "#e3f2fd" }}>
                      <p style={{ color: "#2185FF", fontWeight: "600" }}>
                        Schön, dass Sie angemeldet sind. Wie kann ich Ihnen helfen?
                      </p>
                    </div>
                    <ChatContainer messages={messages} isLoading={isLoading} />
                  </div>
                  <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Chat-Bereich */}
        <div className="chat-section">
          {(messages.length > 0 || isLoading) && (
            <div className="chat-messages-area">
              <ChatContainer messages={messages} isLoading={isLoading} />
            </div>
          )}
          <form className="chat-input-wrapper" onSubmit={handleHomeChatSubmit}>
            <input
              type="text"
              placeholder="Fragen Sie mich alles über Ihre Reisepläne..."
              className="chat-input"
              value={homeMessage}
              onChange={(e) => setHomeMessage(e.target.value)}
              onKeyDown={handleHomeChatKeyDown}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={isLoading || !homeMessage.trim()}
              aria-label="Nachricht senden"
            >
              <Send size={24} />
            </button>
          </form>
        </div>
      </div>

      {/* Anmelde-Modal */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <img src="/WinLogoGlow.png" alt="Logo" style={{ height: 64, objectFit: "contain" }} />
            </div>
            <DialogTitle className="text-2xl font-bold text-center" style={{ color: "#2185FF" }}>
              Anmelden
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                E-Mail
              </label>
              <Input
                type="email"
                placeholder="ihre@email.de"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ borderColor: "#2185FF" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                Passwort
              </label>
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ borderColor: "#2185FF" }}
              />
            </div>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full"
              style={{ backgroundColor: "#2185FF", color: "white", fontWeight: "600" }}
            >
              {isLoggingIn ? "Anmeldung läuft..." : "Anmelden"}
            </Button>
            <p className="text-center text-sm" style={{ color: "#001540" }}>
              Noch kein Konto?{" "}
              <button
                type="button"
                onClick={() => {
                  setLoginModalOpen(false);
                  setSupportModalOpen(false);
                  navigate("/auth");
                }}
                style={{
                  color: "#2185FF",
                  fontWeight: "600",
                  textDecoration: "none",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Hier registrieren
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default IndexDe;
