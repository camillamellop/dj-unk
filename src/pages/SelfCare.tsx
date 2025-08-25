export { PlayerButton };

import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/contexts/AuthContext";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
  Heart,
  Plus,
  Edit3,
  Calendar,
  Moon,
  Users,
  Droplets,
  BarChart3,
  Volume2,
  VolumeX,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";



interface Gratitude {
  id: string;
  content: string;
  type: string;
  date: string;
  user_id: string;
  created_at?: string;
}

interface Metrics {
  diasAtivos: number;
  horasSono: number;
  hidratacao: number;
}

/* Botão interno simples para os controles (alternativa leve ao Button visual) */
function PlayerButton({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "control";
  className?: string;
}) {
  const base =
    "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2";
  const styles =
    variant === "control"
      ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
      : variant === "secondary"
      ? "bg-gray-700 hover:bg-gray-600 text-white"
      : "bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 text-black";
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

/* Util */
const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

type AutoCuidadoPageProps = { onNavigate: (route: string) => void };
const AutoCuidadoPage = ({ onNavigate }: AutoCuidadoPageProps) => {
  const { user } = useAuth();

  /* ======= GRATIDÃO ======= */
  const [gratitudes, setGratitudes] = useState<Gratitude[]>([]);
  const [newGratitude, setNewGratitude] = useState("");
  const [showGratitudeInput, setShowGratitudeInput] = useState(false);
  const [editingGratitudeId, setEditingGratitudeId] = useState<string | null>(null);
  const [editingGratitudeText, setEditingGratitudeText] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchGratitudes = async () => {
      const { data, error } = await supabase
        .from("self_care_activities")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "gratitude")
        .order("created_at", { ascending: false });
      if (!error && data) setGratitudes(data as Gratitude[]);
    };
    fetchGratitudes();
  }, [user]);

  const handleDeleteGratitude = async (id: string) => {
    const { error } = await supabase
      .from("self_care_activities")
      .delete()
      .eq("id", id);
    if (!error) setGratitudes((prev) => prev.filter((g) => g.id !== id));
  };

  const handleEditGratitude = (id: string, text: string) => {
    setEditingGratitudeId(id);
    setEditingGratitudeText(text);
  };

  const handleSaveEditGratitude = async (id: string) => {
    const { error } = await supabase
      .from("self_care_activities")
      .update({ content: editingGratitudeText })
      .eq("id", id);
    if (!error) {
      setGratitudes((prev) => prev.map((g) => (g.id === id ? { ...g, content: editingGratitudeText } : g)));
      setEditingGratitudeId(null);
      setEditingGratitudeText("");
    }
  };

  const addGratitude = async () => {
    if (!user) return;
    const gratitudeText = newGratitude.trim();
    if (!gratitudeText) return;
    // auxiliar (opcional)
    try {
      await supabase
        .from("gratitude_aux")
        .insert([{ text: gratitudeText }]);
    } catch {
      // ignore error
    }
    const payload = { 
      content: gratitudeText, 
      type: "gratitude",
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      user_id: user.id 
    };
    const { data, error } = await supabase
      .from("self_care_activities")
      .insert([payload])
      .select()
      .single();
    if (!error && data) {
      setGratitudes((prev) => [data as Gratitude, ...prev]);
      setNewGratitude("");
      setShowGratitudeInput(false);
    }
  };

  /* ======= MÉTRICAS ======= */
  const [metrics, setMetrics] = useState<Metrics>({ diasAtivos: 0, horasSono: 0, hidratacao: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchMetrics = async () => {
      const { data, error } = await supabase.from("metrics").select("*").eq("user_id", user.id).single();
      if (!error && data) setMetrics(data as Metrics);
    };
    fetchMetrics();
  }, [user]);

  const updateMetric = async (field: keyof Metrics, value: number) => {
    if (!user) return;
    // auxiliar (opcional)
    try {
      await supabase
        .from("metrics_aux")
        .insert([{ name: String(field) }]);
    } catch {
      // ignore error
    }
    const { error } = await supabase.from("metrics").upsert({ user_id: user.id, [field]: value }, { onConflict: "user_id" });
    if (!error) setMetrics((prev) => ({ ...prev, [field]: value }));
  };

  const getMetricPercentage = (value: number, max: number) => Math.min((value / max) * 100, 100);

  /* ======= EQUALIZER VISUAL (para métricas) ======= */
  const [bars, setBars] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      height: Math.random() * 60 + 20,
      delay: i * 0.1,
    }))
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setBars((prev) =>
        prev.map((b) => ({
          ...b,
          height: Math.min(80, Math.max(15, b.height + (Math.random() * 40 - 20))),
        }))
      );
    }, 400);
    return () => window.clearInterval(id);
  }, []);

  /* ======= PAUSA PARA RESPIRAR ======= */
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathTimer, setBreathTimer] = useState(0);
  const breathIntervalRef = useRef<number | null>(null);

  const startBreathTimer = () => {
    if (breathIntervalRef.current) return;
    setBreathRunning(true);
    breathIntervalRef.current = window.setInterval(() => {
      setBreathTimer((s) => s + 1);
    }, 1000);
  };

  const pauseBreathTimer = () => {
    if (breathIntervalRef.current) {
      window.clearInterval(breathIntervalRef.current);
      breathIntervalRef.current = null;
    }
    setBreathRunning(false);
  };

  const resetBreathTimer = () => {
    pauseBreathTimer();
    setBreathTimer(0);
  };

  useEffect(() => {
    return () => {
      if (breathIntervalRef.current) window.clearInterval(breathIntervalRef.current);
    };
  }, []);

  /* ======= CHECK AUDITIVO (WebAudio) ======= */
  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const [hearingCheckLevel, setHearingCheckLevel] = useState(50); // 0-100
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const playAudioTest = () => {
    if (isPlayingTone) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 1000; // 1kHz
    const linear = hearingCheckLevel / 100;
    // curva log simples para volume mais natural
    gain.gain.value = Math.pow(linear, 2) * 0.3; // evita muito alto
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    audioCtxRef.current = ctx;
    oscRef.current = osc;
    gainRef.current = gain;
    setIsPlayingTone(true);
  };

  const stopAudioTest = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
      } catch {}
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (gainRef.current) {
      try {
        gainRef.current.disconnect();
      } catch {}
      gainRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    setIsPlayingTone(false);
  };

  useEffect(() => {
    // atualizar volume em tempo real
    if (gainRef.current) {
      const linear = hearingCheckLevel / 100;
      gainRef.current.gain.value = Math.pow(linear, 2) * 0.3;
    }
  }, [hearingCheckLevel]);

  useEffect(() => {
    return () => stopAudioTest();
  }, []);

  /* ======= FRASES CURTAS (Mood/AutoCuidado) ======= */
  // substitui os "cards" por frases estilo cápsulas para ocupar pouco espaço
  const carePhrases: { id: string; icon: any; text: string }[] = [
    {
      id: "mood-tracker",
      icon: Heart,
      text: "Cheque seu humor de hoje — tudo bem pedir ajuda.",
    },
    {
      id: "sono",
      icon: Moon,
      text: "Tente um horário fixo de sono: sua mente agradece.",
    },
    {
      id: "social",
      icon: Users,
      text: "Converse com outros DJs — comunidade é antídoto de burnout.",
    },
    {
      id: "autocuidado",
      icon: Heart,
      text: "Separe um hobby fora da música para recarregar.",
    },
  ];

  /* ======= FRASE DO DIA ======= */
  const motivationalQuotes = [
    "Conecte-se consigo mesmo antes de conectar-se com o público.",
    "Sua criatividade floresce quando você cuida da sua energia.",
    "Cada batida é uma oportunidade de expressar sua essência.",
  ];
  const getRandomQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return motivationalQuotes[dayOfYear % motivationalQuotes.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="p-4 sm:p-6 flex items-center">
        <button
          onClick={() => onNavigate("home")}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            AutoCuidado DJ
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Sua saúde mental e bem-estar são tão importantes quanto suas mixagens.
          </p>
        </div>
      </div>

      <div className="px-3 sm:px-6 pb-6 space-y-6">
        {/* Frase do dia */}
        <div className="bg-gradient-to-r from-gray-700 to-blue-900 rounded-2xl p-4 sm:p-6 text-center">
          <p className="text-sm sm:text-lg font-medium italic text-gray-100">"{getRandomQuote()}"</p>
        </div>

        {/* Pausa para Respirar */}
        <GlassCard variant="gradient" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Pausa para Respirar</h3>
              <p className="text-sm text-gray-400">Respire fundo e relaxe por um momento</p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div
              className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center ${
                breathRunning ? "border-green-400 bg-green-400/10 animate-pulse" : "border-gray-600 bg-gray-800/50"
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-white">{formatTime(breathTimer)}</div>
                <div className="text-xs text-gray-400 mt-1">{breathRunning ? "Respirando..." : "Pronto"}</div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                onClick={breathRunning ? pauseBreathTimer : startBreathTimer}
                variant="outline"
                className="flex items-center gap-2 text-green-400 border-green-400 hover:bg-green-400/10"
              >
                {breathRunning ? <Pause size={16} /> : <Play size={16} />}
                {breathRunning ? "Pausar" : "Iniciar"}
              </Button>

              <Button
                onClick={resetBreathTimer}
                variant="outline"
                className="flex items-center gap-2 text-gray-400 border-gray-400 hover:bg-gray-400/10"
              >
                <RotateCcw size={16} />
                Reset
              </Button>
            </div>

            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Inspire 4s — segure 4s — expire 4s. Repita até se sentir melhor.
            </p>
          </div>
        </GlassCard>

        {/* Mood-tracker/Autocuidado — MODO FRASE (compacto) */}
        <div className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/40">
          <div className="flex flex-col gap-2">
            {carePhrases.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-start gap-2 text-sm">
                  <Icon size={16} className="mt-0.5 text-purple-300 flex-shrink-0" />
                  <p className="text-gray-200">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Métricas */}
        <GlassCard variant="gradient" className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center justify-center gap-2">
              <BarChart3 size={20} className="text-purple-400" />
              Suas Métricas de Bem-estar
            </h2>

            {/* Equalizer central */}
            <div className="flex items-end justify-center space-x-1.5 h-12 mx-auto">
              {bars.map((bar, i) => {
                const grads = [
                  "from-pink-500 to-purple-500",
                  "from-blue-500 to-cyan-400",
                  "from-green-400 to-lime-400",
                  "from-yellow-400 to-orange-500",
                  "from-purple-500 to-pink-400",
                  "from-cyan-400 to-blue-500",
                ];
                const grad = grads[i % grads.length];
                return (
                  <div
                    key={bar.id}
                    className={`bg-gradient-to-t ${grad} w-2 rounded-t-sm transition-all duration-300`}
                    style={{ height: `${bar.height}%`, animationDelay: `${bar.delay}s` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Cards de métrica (três colunas no mobile) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-gradient-to-br from-purple-600/30 to-blue-600/20 rounded-xl p-3 sm:p-4 border border-purple-500/30 flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] shadow-lg">
              <Calendar size={20} className="text-purple-400 mb-1 sm:mb-2" />
              <div className="text-xl sm:text-3xl font-bold text-white mb-1">{metrics.diasAtivos}</div>
              <div className="text-xs sm:text-sm text-gray-300 text-center">Dias Ativos</div>
              <div className="text-[10px] sm:text-xs text-gray-400 mt-1">Esta semana</div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-black/30 rounded-xl p-3 sm:p-4 border border-blue-500/30 flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] shadow-lg">
              <Moon size={20} className="text-blue-400 mb-1 sm:mb-2" />
              <div className="text-xl sm:text-3xl font-bold text-white mb-1">{metrics.horasSono}h</div>
              <div className="text-xs sm:text-sm text-gray-300 text-center">Horas de Sono</div>
              <div className="text-[10px] sm:text-xs text-gray-400 mt-1">Média diária</div>
            </div>

            <div className="bg-gradient-to-br from-cyan-600/30 to-purple-600/20 rounded-xl p-3 sm:p-4 border border-cyan-500/30 flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] shadow-lg">
              <Droplets size={20} className="text-cyan-400 mb-1 sm:mb-2" />
              <div className="text-xl sm:text-3xl font-bold text-white mb-1">{metrics.hidratacao}L</div>
              <div className="text-xs sm:text-sm text-gray-300 text-center">Hidratação</div>
              <div className="text-[10px] sm:text-xs text-gray-400 mt-1">Litros/dia</div>
            </div>
          </div>

          {/* Equalizador de métricas (barras grandes) */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-purple-400" />
              Equalizador de Métricas
            </h3>

            <div className="flex items-end justify-center gap-4 sm:gap-8 h-32 sm:h-40">
              {/* Dias ativos */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 sm:w-16 h-24 sm:h-32 bg-gray-700 rounded-lg relative overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-pink-400 rounded-lg transition-all duration-1000"
                    style={{ height: `${getMetricPercentage(metrics.diasAtivos, 7)}%` }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-300">Dias Ativos</div>
                  <div className="text-sm sm:text-lg font-bold text-white">
                    {Math.round(getMetricPercentage(metrics.diasAtivos, 7))}%
                  </div>
                </div>
              </div>

              {/* Sono */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 sm:w-16 h-24 sm:h-32 bg-gray-700 rounded-lg relative overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-lg transition-all duration-1000"
                    style={{ height: `${getMetricPercentage(metrics.horasSono, 8)}%` }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-300">Sono</div>
                  <div className="text-sm sm:text-lg font-bold text-white">
                    {Math.round(getMetricPercentage(metrics.horasSono, 8))}%
                  </div>
                </div>
              </div>

              {/* Hidratação */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 sm:w-16 h-24 sm:h-32 bg-gray-700 rounded-lg relative overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-500 to-teal-400 rounded-lg transition-all duration-1000"
                    style={{ height: `${getMetricPercentage(metrics.hidratacao, 3)}%` }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-300">Hidratação</div>
                  <div className="text-sm sm:text-lg font-bold text-white">
                    {Math.round(getMetricPercentage(metrics.hidratacao, 3))}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Check Auditivo */}
        <GlassCard variant="music" className="space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Check Auditivo</h3>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
              {isPlayingTone ? (
                <Volume2 className="w-8 h-8 text-yellow-400 animate-pulse" />
              ) : (
                <VolumeX className="w-8 h-8 text-gray-400" />
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Nível/Frequência (volume): {hearingCheckLevel}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hearingCheckLevel}
                  onChange={(e) => setHearingCheckLevel(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <Button
                onClick={() => (isPlayingTone ? stopAudioTest() : playAudioTest())}
                variant="outline"
                className="w-full text-yellow-400 border-yellow-400 hover:bg-yellow-400/10"
              >
                {isPlayingTone ? "Parar Tom" : "Reproduzir Tom"}
              </Button>
            </div>
          </div>

          <div className="bg-yellow-500/10 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-300">
                Use fones para um teste mais preciso. Se notar mudanças na audição, procure um profissional.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Pote da Gratidão */}
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Pote da Gratidão</h3>
              <p className="text-sm text-gray-400">Guarde aqui suas alegrias e conquistas</p>
            </div>
          </div>

          {showGratitudeInput ? (
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGratitude}
                  onChange={(e) => setNewGratitude(e.target.value)}
                  placeholder="Pelo que você é grato hoje?"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  onKeyDown={(e) => e.key === "Enter" && addGratitude()}
                  autoFocus
                />
                <button
                  onClick={addGratitude}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-lg font-medium hover:from-cyan-500 hover:to-teal-600 transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowGratitudeInput(true)}
              className="w-full mb-4 p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              <span className="text-sm">Conseguiu fazer um set incrível? Conte pra gente!</span>
            </button>
          )}

          {gratitudes.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {gratitudes.map((gratitude) => (
                <div
                  key={gratitude.id}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 flex flex-col gap-2 relative"
                >
                  {editingGratitudeId === gratitude.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={editingGratitudeText}
                        onChange={(e) => setEditingGratitudeText(e.target.value)}
                        className="w-full bg-gray-800 border border-cyan-400 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEditGratitude(gratitude.id);
                          if (e.key === "Escape") {
                            setEditingGratitudeId(null);
                            setEditingGratitudeText("");
                          }
                        }}
                        onBlur={() => handleSaveEditGratitude(gratitude.id)}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleSaveEditGratitude(gratitude.id)}
                          className="px-2 py-1 rounded bg-cyan-600 text-white text-xs font-medium hover:bg-cyan-700"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setEditingGratitudeId(null);
                            setEditingGratitudeText("");
                          }}
                          className="px-2 py-1 rounded bg-gray-600 text-white text-xs font-medium hover:bg-gray-700"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-white mb-2">{gratitude.content}</p>
                      <p className="text-xs text-gray-400">{new Date(gratitude.date).toLocaleString()}</p>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => handleEditGratitude(gratitude.id, gratitude.content)}
                          className="text-cyan-400 hover:text-cyan-200 p-1"
                          title="Editar"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteGratitude(gratitude.id)}
                          className="text-red-400 hover:text-red-200 p-1"
                          title="Excluir"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {gratitudes.length === 0 && !showGratitudeInput && (
            <div className="text-center py-8 text-gray-400">
              <Heart size={48} className="mx-auto mb-4 opacity-50" />
              <p>Seu pote está vazio</p>
              <p className="text-sm mt-1">Que tal adicionar algo pelo qual você é grato?</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoCuidadoPage;
