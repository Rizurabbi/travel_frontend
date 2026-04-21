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

const IndexFr = () => {
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage } = useChat();
  const hasActiveConversation = messages.length > 0 || isLoading;
  const { user, token, login } = useAuth();
  const { toast } = useToast();
  const [homeMessage, setHomeMessage] = useState("");

  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [supportAccessInfo, setSupportAccessInfo] = useState<any>(null);
  const [travelDates, setTravelDates] = useState({ startDate: "", endDate: "" });
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
          setSupportModalOpen(false);
          navigate('/customer-support');
        } else {
          setSupportModalOpen(true);
        }
      } else {
        toast({ title: "Erreur", description: data.error || "Impossible de vérifier l'accès au support", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Impossible de vérifier l'accès au support", variant: "destructive" });
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
      toast({ title: "Erreur", description: "Veuillez sélectionner vos dates de voyage", variant: "destructive" });
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
      toast({ title: "Erreur", description: "Veuillez entrer votre adresse e-mail et votre mot de passe", variant: "destructive" });
      return;
    }
    setIsLoggingIn(true);
    try {
      await login(loginEmail, loginPassword);
      setLoginModalOpen(false);
      setSupportModalOpen(false);
      setLoginEmail("");
      setLoginPassword("");
      navigate('/support-access');
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Échec de la connexion", variant: "destructive" });
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
        {/* Section Logo */}
        <div className="logo-section">
          <img src="/logoname.png" alt="OPENSKAI" className="openskai-name-image" />
        </div>

        {/* Section Cartes de Services */}
        {!hasActiveConversation && <div className="services-section">
          {/* Réservation de Voyage */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="service-card">
                <img src="/Airplane_Icon.png" alt="Réservation de voyage" className="service-icon" />
                <h3 className="service-title">RÉSERVATION<br />DE VOYAGE</h3>
                <p className="service-description">Réservez des billets d'avion, hôtels, forfaits touristiques et plus.</p>
                <button className="learn-more-btn">EN SAVOIR PLUS...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                  Réservation de Voyage
                </DialogTitle>
                <p className="text-lg text-gray-700">
                  Réservez des billets d'avion, des hôtels, des forfaits touristiques et plus encore.
                </p>
              </DialogHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="why" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Pourquoi Réserver un Voyage ?
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Nous croyons que voyager est plus que visiter de nouveaux endroits—il s'agit de créer des expériences
                      significatives. Nos forfaits soigneusement conçus combinent aventure, confort et immersion culturelle
                      pour vous offrir le voyage d'une vie. Des plages exotiques aux retraites en montagne, nous gérons
                      chaque détail pour que vous puissiez vous concentrer sur la création de souvenirs.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="why-us" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Pourquoi Nous ?
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Avec plus d'une décennie d'expérience, nous avons perfectionné l'art de créer des voyages inoubliables.
                      Notre équipe sélectionne soigneusement chaque destination et activité pour garantir qualité et
                      authenticité. Nous offrons un support 24h/24, des options de réservation flexibles et le meilleur
                      rapport qualité-prix.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>

          {/* Assurance Voyage */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="service-card">
                <img src="/Shield_Icon.png" alt="Assurance voyage" className="service-icon" />
                <h3 className="service-title">ASSURANCE<br />VOYAGE</h3>
                <p className="service-description">Restez protégé lors de votre voyage</p>
                <button className="learn-more-btn">EN SAVOIR PLUS...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                  Assurance Voyage
                </DialogTitle>
                <p className="text-lg text-gray-700">
                  Voyagez en toute confiance en sachant que vous êtes protégé contre l'inattendu
                </p>
              </DialogHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="why" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Pourquoi une Assurance ?
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Notre assurance voyage complète vous protège contre les urgences médicales, les annulations de voyage,
                      la perte de bagages et plus encore. Voyagez l'esprit tranquille en sachant que vous êtes couvert
                      où que vous alliez.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>

          {/* Banque de Voyage */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="service-card">
                <img src="/Wallet_icon.png" alt="Banque de voyage" className="service-icon" />
                <h3 className="service-title">BANQUE DE<br />VOYAGE</h3>
                <p className="service-description">Solutions de paiement sécurisées partout dans le monde</p>
                <button className="learn-more-btn">EN SAVOIR PLUS...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                  Banque de Voyage
                </DialogTitle>
                <p className="text-lg text-gray-700">
                  Des solutions de paiement sécurisées, pratiques et flexibles pour tous vos besoins de voyage
                </p>
              </DialogHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="features" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Caractéristiques Principales
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Support multidevises, Taux de change compétitifs, Transactions sécurisées, Support client 24h/24
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>

          {/* Assistance Client */}
          <Dialog open={supportModalOpen} onOpenChange={setSupportModalOpen}>
            <DialogTrigger asChild>
              <div className="service-card" onClick={checkSupportAccess}>
                <img src="/Support_Icon.png" alt="Assistance client" className="service-icon" />
                <h3 className="service-title">ASSISTANCE<br />CLIENT</h3>
                <p className="service-description">Assistance 24h/24 et 7j/7</p>
                <button className="learn-more-btn">EN SAVOIR PLUS...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              {
                <>
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                      Assistance Client 24h/24
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: "#f0f4ff", borderLeft: "4px solid #2185FF" }}>
                      <h3 className="font-bold text-lg mb-3" style={{ color: "#001540" }}>
                        À Propos de Notre Service de Support
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Ce service est disponible pour tous les clients ayant effectué un achat sur notre site.
                        Si vous n'avez pas encore acheté chez nous, il y a des frais de <strong>1 $ par jour</strong> pour utiliser notre ligne de support.
                      </p>
                      <p className="text-gray-700">
                        Nous devrons connaître vos dates de voyage exactes pour calculer les frais totaux.
                        Une fois que vous aurez fourni vos dates, nous vous montrerons le coût et traiterons votre paiement.
                      </p>
                    </div>

                    {!user ? (
                      <div className="text-center py-4">
                        <p className="mb-4 text-gray-700">Veuillez vous connecter pour accéder au support</p>
                        <Button
                          onClick={() => { setSupportModalOpen(false); setLoginModalOpen(true); }}
                          style={{ backgroundColor: "#2185FF", color: "white", fontWeight: "600" }}
                        >
                          Se Connecter ou S'inscrire
                        </Button>
                      </div>
                    ) : supportAccessInfo?.has_access ? (
                      <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#e8f5e9" }}>
                        <p className="text-green-700 font-bold text-lg">
                          ✓ Vous avez déjà accès au support
                        </p>
                        <Button
                          onClick={() => navigate('/customer-support')}
                          className="mt-4"
                          style={{ backgroundColor: "#2185FF", color: "white", fontWeight: "600" }}
                        >
                          Ouvrir le chat support
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                            Date de Début du Voyage *
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
                            Date de Fin du Voyage *
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
                            <p className="text-sm text-gray-700">Coût Estimé</p>
                            <p className="text-3xl font-bold" style={{ color: "#2185FF" }}>
                              ${estimatedCost}.00
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {estimatedCost} jour{estimatedCost !== 1 ? "s" : ""} × 1 $/jour
                            </p>
                          </div>
                        )}
                        <Button
                          onClick={handleSupportPayment}
                          disabled={isProcessingPayment || estimatedCost === 0}
                          className="w-full"
                          style={{ backgroundColor: "#2185FF", color: "white", fontWeight: "600" }}
                        >
                          {isProcessingPayment ? "Traitement en cours..." : "Continuer vers les plans de paiement"}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              }
            </DialogContent>
          </Dialog>
        </div>}

        {/* Section Chat */}
        <div className="chat-section">
          {hasActiveConversation && (
            <div className="chat-messages-area">
              <ChatContainer messages={messages} isLoading={isLoading} />
            </div>
          )}
          <form className="chat-input-wrapper" onSubmit={handleHomeChatSubmit}>
            <input
              type="text"
              placeholder="Posez-moi une question sur vos projets de voyage..."
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
              aria-label="Envoyer le message"
            >
              <Send size={24} />
            </button>
          </form>
        </div>
      </div>

      {/* Modal de Connexion */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <img src="/WinLogoGlow.png" alt="Logo" style={{ height: 64, objectFit: "contain" }} />
            </div>
            <DialogTitle className="text-2xl font-bold text-center" style={{ color: "#2185FF" }}>
              Se Connecter
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                Adresse e-mail
              </label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ borderColor: "#2185FF" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                Mot de passe
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
              {isLoggingIn ? "Connexion en cours..." : "Se Connecter"}
            </Button>
            <p className="text-center text-sm" style={{ color: "#001540" }}>
              Pas encore de compte ?{" "}
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
                Inscrivez-vous ici
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default IndexFr;
