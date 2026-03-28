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
import "../styles/index.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "https://openskai.onrender.com";

const IndexEs = () => {
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
      const response = await fetch(`${API_BASE_URL}/api/support/access`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setSupportAccessInfo(data);
        if (data.has_access) {
          setShowSupportChat(true);
        } else {
          setSupportModalOpen(true);
        }
      } else {
        toast({ title: "Error", description: data.error || "Failed to check support access", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to check support access", variant: "destructive" });
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
      toast({ title: "Error", description: "Por favor selecciona las fechas de viaje", variant: "destructive" });
      return;
    }
    setIsProcessingPayment(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/support/purchase-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ start_date: travelDates.startDate, end_date: travelDates.endDate, days: estimatedCost, amount: estimatedCost }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to initiate payment");
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        setSupportAccessInfo(data);
        setShowSupportChat(true);
        setSupportModalOpen(false);
        toast({ title: "Éxito", description: "¡Acceso al soporte concedido!" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to process payment", variant: "destructive" });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({ title: "Error", description: "Por favor ingresa tu correo y contraseña", variant: "destructive" });
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
      toast({ title: "Error", description: error.message || "Error al iniciar sesión", variant: "destructive" });
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
        {/* Sección Logo */}
        <div className="logo-section">
          <img src="/logoname.png" alt="OPENSKAI" className="openskai-name-image" />
        </div>

        {/* Sección Tarjetas de Servicio */}
        <div className="services-section">
          {/* Reserva de Viaje */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="service-card">
                <img src="/Airplane_Icon.png" alt="Reserva de viaje" className="service-icon" />
                <h3 className="service-title">RESERVA DE<br />VIAJE</h3>
                <p className="service-description">Reserva vuelos, hoteles, paquetes turísticos y más.</p>
                <button className="learn-more-btn">MÁS INFO...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                  Reserva de Viaje
                </DialogTitle>
                <p className="text-lg text-gray-700">
                  Reserva vuelos, hoteles, paquetes turísticos y más.
                </p>
              </DialogHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="why" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      ¿Por qué Reserva de Viaje?
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Creemos que viajar es más que visitar nuevos lugares—se trata de crear experiencias significativas.
                      Nuestros paquetes cuidadosamente diseñados combinan aventura, confort e inmersión cultural para
                      brindarte el viaje de tu vida. Desde playas exóticas hasta retiros en la montaña, nos encargamos
                      de cada detalle para que puedas concentrarte en crear recuerdos.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="why-us" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      ¿Por qué Nosotros?
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Con más de una década de experiencia, hemos perfeccionado el arte de crear viajes inolvidables.
                      Nuestro equipo selecciona cuidadosamente cada destino y actividad para garantizar calidad y
                      autenticidad. Ofrecemos soporte 24/7, opciones de reserva flexibles y el mejor valor por tu dinero.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>

          {/* Seguro de Viaje */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="service-card">
                <img src="/Shield_Icon.png" alt="Seguro de viaje" className="service-icon" />
                <h3 className="service-title">SEGURO DE<br />VIAJE</h3>
                <p className="service-description">Mantente protegido en tu viaje</p>
                <button className="learn-more-btn">MÁS INFO...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                  Seguro de Viaje
                </DialogTitle>
                <p className="text-lg text-gray-700">
                  Viaja con confianza sabiendo que estás protegido contra lo inesperado
                </p>
              </DialogHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="why" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      ¿Por qué un Seguro?
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Nuestro seguro de viaje integral te protege contra emergencias médicas, cancelaciones de viaje,
                      equipaje perdido y más. Viaja con tranquilidad sabiendo que estás cubierto dondequiera que vayas.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>

          {/* Banca de Viaje */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="service-card">
                <img src="/Wallet_icon.png" alt="Banca de viaje" className="service-icon" />
                <h3 className="service-title">BANCA DE<br />VIAJE</h3>
                <p className="service-description">Soluciones de pago seguras sin fronteras</p>
                <button className="learn-more-btn">MÁS INFO...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                  Banca de Viaje
                </DialogTitle>
                <p className="text-lg text-gray-700">
                  Soluciones de pago seguras, convenientes y flexibles para todas tus necesidades de viaje
                </p>
              </DialogHeader>
              <div className="mt-6">
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="features" className="rounded-lg border">
                    <AccordionTrigger className="text-lg font-semibold px-6 py-3" style={{ color: "#2185FF" }}>
                      Características Principales
                    </AccordionTrigger>
                    <AccordionContent className="text-base px-6 py-4 text-gray-700">
                      Soporte multidivisa, Tasas de cambio competitivas, Transacciones seguras, Atención al cliente 24/7
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DialogContent>
          </Dialog>

          {/* Atención al Cliente */}
          <Dialog open={supportModalOpen} onOpenChange={setSupportModalOpen}>
            <DialogTrigger asChild>
              <div className="service-card" onClick={checkSupportAccess}>
                <img src="/Support_Icon.png" alt="Atención al cliente" className="service-icon" />
                <h3 className="service-title">ATENCIÓN AL<br />CLIENTE</h3>
                <p className="service-description">Asistencia 24/7</p>
                <button className="learn-more-btn">MÁS INFO...</button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              {!showSupportChat ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold mb-4" style={{ color: "#2185FF" }}>
                      Atención al Cliente 24/7
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: "#f0f4ff", borderLeft: "4px solid #2185FF" }}>
                      <h3 className="font-bold text-lg mb-3" style={{ color: "#001540" }}>
                        Acerca de Nuestro Servicio de Soporte
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Este servicio está disponible para todos los clientes que hayan comprado en nuestro sitio.
                        Si aún no has comprado con nosotros, hay un cargo de <strong>$1 por día</strong> para usar nuestra línea de soporte.
                      </p>
                      <p className="text-gray-700">
                        Necesitaremos conocer tus fechas de viaje exactas para calcular el cargo total.
                        Una vez que proporciones tus fechas, te mostraremos el costo y procesaremos tu pago.
                      </p>
                    </div>

                    {!user ? (
                      <div className="text-center py-4">
                        <p className="mb-4 text-gray-700">Por favor inicia sesión para acceder al soporte</p>
                        <Button
                          onClick={() => { setSupportModalOpen(false); setLoginModalOpen(true); }}
                          style={{ backgroundColor: "#2185FF", color: "white", fontWeight: "600" }}
                        >
                          Iniciar Sesión o Registrarse
                        </Button>
                      </div>
                    ) : supportAccessInfo?.has_access ? (
                      <div className="p-4 rounded-lg text-center" style={{ backgroundColor: "#e8f5e9" }}>
                        <p className="text-green-700 font-bold text-lg">
                          ✓ Tienes acceso al soporte hasta el {new Date(supportAccessInfo.expires_at).toLocaleDateString()}
                        </p>
                        <Button
                          onClick={() => setShowSupportChat(true)}
                          className="mt-4"
                          style={{ backgroundColor: "#2185FF", color: "white", fontWeight: "600" }}
                        >
                          Iniciar Chat
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                            Fecha de Inicio del Viaje *
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
                            Fecha de Fin del Viaje *
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
                            <p className="text-sm text-gray-700">Costo Estimado</p>
                            <p className="text-3xl font-bold" style={{ color: "#2185FF" }}>
                              ${estimatedCost}.00
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {estimatedCost} día{estimatedCost !== 1 ? "s" : ""} × $1/día
                            </p>
                          </div>
                        )}
                        <Button
                          onClick={handleSupportPayment}
                          disabled={isProcessingPayment || estimatedCost === 0}
                          className="w-full"
                          style={{ backgroundColor: "#2185FF", color: "white", fontWeight: "600" }}
                        >
                          {isProcessingPayment ? "Procesando..." : `Pagar $${estimatedCost}.00`}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold" style={{ color: "#2185FF" }}>
                      Chat de Soporte en Vivo
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="p-4 rounded-lg text-center mb-4" style={{ backgroundColor: "#e3f2fd" }}>
                      <p style={{ color: "#2185FF", fontWeight: "600" }}>
                        Es un placer tenerte conectado. ¿En qué puedo ayudarte?
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

        {/* Sección Chat */}
        <div className="chat-section">
          <form className="chat-input-wrapper" onSubmit={handleHomeChatSubmit}>
            <input
              type="text"
              placeholder="Pregúntame cualquier cosa sobre tus planes de viaje..."
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
              aria-label="Enviar mensaje"
            >
              <Send size={24} />
            </button>
          </form>
        </div>
      </div>

      {/* Modal de Inicio de Sesión */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-3">
              <img src="/WinLogoGlow.png" alt="Logo" style={{ height: 64, objectFit: "contain" }} />
            </div>
            <DialogTitle className="text-2xl font-bold text-center" style={{ color: "#2185FF" }}>
              Iniciar Sesión
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                Correo Electrónico
              </label>
              <Input
                type="email"
                placeholder="tu@correo.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ borderColor: "#2185FF" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#001540" }}>
                Contraseña
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
              {isLoggingIn ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
            <p className="text-center text-sm" style={{ color: "#001540" }}>
              ¿No tienes una cuenta?{" "}
              <a href="/auth" style={{ color: "#2185FF", fontWeight: "600", textDecoration: "none" }}>
                Regístrate aquí
              </a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default IndexEs;
