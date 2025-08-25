import React, { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Calendar as CalendarIcon, Clock, DollarSign, MapPin, User, PlusCircle } from "lucide-react"

interface DJ {
  id: string
  name: string
}

interface Evento {
  id: string
  titulo: string
  descricao?: string
  data_inicio: string
  data_fim?: string
  local_nome?: string
  local_endereco?: string
  status: "agendado" | "confirmado" | "cancelado" | "concluido"
  user_id?: string  // Corrigido: usar user_id em vez de dj_id
  valor_cache?: number
  compartilhado: boolean
}

// buscar DJs cadastrados
function useDJs() {
  return useQuery<DJ[]>({
    queryKey: ["djs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("role", "dj")

      if (error) throw error
      return data as DJ[]
    },
  })
}

// buscar eventos (todos para admin)
function useEventos() {
  return useQuery<Evento[]>({
    queryKey: ["eventos-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .order("data_inicio", { ascending: true })

      if (error) throw error
      return data as Evento[]
    },
  })
}

// mutation: atualizar evento
function useUpdateEvento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (evento: Partial<Evento> & { id: string }) => {
      const { data, error } = await supabase
        .from("eventos")
        .update(evento)
        .eq("id", evento.id)
        .select()
        .single()

      if (error) throw error

      // se confirmado e com cachê → cria pendência em unkash
      if (data.status === "confirmado" && data.valor_cache && data.user_id) {
        await supabase.from("unkash").insert({
          evento_id: data.id,
          user_id: data.user_id,
          valor: data.valor_cache,
          status: "pendente",
        })
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventos-admin"] })
    },
  })
}

// mutation: criar evento
function useCreateEvento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newEvent: Omit<Evento, "id">) => {
      const { data, error } = await supabase
        .from("eventos")
        .insert(newEvent)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventos-admin"] })
    },
  })
}

export default function AgendaAdmin() {
  const { data: eventos = [] } = useEventos()
  const { data: djs = [] } = useDJs()
  const updateEvento = useUpdateEvento()
  const createEvento = useCreateEvento()

  const [editing, setEditing] = useState<Evento | null>(null)
  const [creatingNewEvent, setCreatingNewEvent] = useState(false)
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    local_nome: "",
    local_endereco: "",
    user_id: "", // Consistente com user_id
    valor_cache: 0,
    status: "agendado" as const,
    compartilhado: false,
  })

  const handleEdit = (evento: Evento) => {
    setEditing(evento)
    setForm({
      titulo: evento.titulo,
      descricao: evento.descricao || "",
      data_inicio: evento.data_inicio,
      data_fim: evento.data_fim || "",
      local_nome: evento.local_nome || "",
      local_endereco: evento.local_endereco || "",
      user_id: evento.user_id || "", // Corrigido
      valor_cache: evento.valor_cache || 0,
      status: "agendado",
      compartilhado: evento.compartilhado,
    })
  }

  const handleSaveEdit = async () => {
    if (!editing) return
    await updateEvento.mutateAsync({
      id: editing.id,
      user_id: form.user_id, // Corrigido
      valor_cache: form.valor_cache,
      status: form.status,
      titulo: form.titulo,
      descricao: form.descricao,
      data_inicio: form.data_inicio,
      data_fim: form.data_fim,
      local_nome: form.local_nome,
      local_endereco: form.local_endereco,
      compartilhado: form.compartilhado,
    })
    setEditing(null)
  }

  const handleCreateNewEvent = async () => {
    // Basic validation
    if (!form.titulo || !form.data_inicio) {
      alert("Título e Data de Início são obrigatórios.")
      return
    }

    await createEvento.mutateAsync({
      titulo: form.titulo,
      descricao: form.descricao,
      data_inicio: form.data_inicio,
      data_fim: form.data_fim,
      local_nome: form.local_nome,
      local_endereco: form.local_endereco,
      user_id: form.user_id === "" ? undefined : form.user_id, // Corrigido
      valor_cache: form.valor_cache,
      status: form.status,
      compartilhado: form.compartilhado,
    })
    setCreatingNewEvent(false)
    resetForm()
  }

  const resetForm = () => {
    setForm({
      titulo: "",
      descricao: "",
      data_inicio: "",
      data_fim: "",
      local_nome: "",
      local_endereco: "",
      user_id: "", // Consistente
      valor_cache: 0,
      status: "agendado",
      compartilhado: false,
    })
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Agenda (Admin)</h1>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          resetForm()
          setCreatingNewEvent(true)
        }}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
      >
        <PlusCircle size={20} /> Novo Evento
      </motion.button>

      <div className="space-y-4">
        {eventos.map((ev) => (
          <motion.div
            key={ev.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 cursor-pointer"
            onClick={() => handleEdit(ev)}
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg text-white">{ev.titulo}</h2>
                <div className="text-sm text-gray-400 flex gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <CalendarIcon size={14} />
                    {new Date(ev.data_inicio).toLocaleDateString("pt-BR")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(ev.data_inicio).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {ev.local_nome && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {ev.local_nome}
                    </span>
                  )}
                  {ev.user_id && ( // Corrigido
                    <span className="flex items-center gap-1" title={`ID do DJ: ${ev.user_id}`}>
                      <User size={14} /> {djs.find(dj => dj.id === ev.user_id)?.name || "Usuário Não Encontrado"}
                    </span>
                  )}
                </div>
                {ev.descricao && <p className="text-sm text-gray-300 mt-2">{ev.descricao}</p>}
              </div>
              {ev.valor_cache && (
                <div className="text-green-400 flex items-center gap-1">
                  <DollarSign size={16} /> R${ev.valor_cache}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal edição */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-black/90 rounded-2xl border border-white/20 p-6 w-full max-w-lg space-y-4">
            <h2 className="text-xl text-white">Editar Evento</h2>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Título</label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Descrição</label>
              <textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Data de Início</label>
              <input
                type="datetime-local"
                value={form.data_inicio ? new Date(form.data_inicio).toISOString().slice(0, 16) : ""}
                onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Data de Fim (Opcional)</label>
              <input
                type="datetime-local"
                value={form.data_fim ? new Date(form.data_fim).toISOString().slice(0, 16) : ""}
                onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Nome do Local</label>
              <input
                type="text"
                value={form.local_nome}
                onChange={(e) => setForm({ ...form, local_nome: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Endereço do Local</label>
              <input
                type="text"
                value={form.local_endereco}
                onChange={(e) => setForm({ ...form, local_endereco: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">DJ</label>
              <select
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              >
                <option value="">Selecione...</option>
                {djs.map((dj) => (
                  <option key={dj.id} value={dj.id} className="bg-gray-900">
                    {dj.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Valor do Cachê
              </label>
              <input
                type="number"
                value={form.valor_cache}
                onChange={(e) =>
                  setForm({ ...form, valor_cache: parseFloat(e.target.value) || 0 })
                }
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="compartilhado-edit"
                checked={form.compartilhado}
                onChange={(e) => setForm({ ...form, compartilhado: e.target.checked })}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="compartilhado-edit" className="text-gray-300 text-sm">
                Compartilhar com o DJ selecionado
              </label>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as "agendado"  })}
                className="w-full p-2 rounded bg-white/10 text-white"
              >
                <option value="agendado">Agendado</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-gray-300"
              >
                Cancelar
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg"
              >
                Salvar
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Novo Evento */}
      {creatingNewEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-black/90 rounded-2xl border border-white/20 p-6 w-full max-w-lg space-y-4">
            <h2 className="text-xl text-white">Criar Novo Evento</h2>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Título</label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Descrição</label>
              <textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Data de Início</label>
              <input
                type="datetime-local"
                value={form.data_inicio}
                onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Data de Fim (Opcional)</label>
              <input
                type="datetime-local"
                value={form.data_fim}
                onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Nome do Local</label>
              <input
                type="text"
                value={form.local_nome}
                onChange={(e) => setForm({ ...form, local_nome: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Endereço do Local</label>
              <input
                type="text"
                value={form.local_endereco}
                onChange={(e) => setForm({ ...form, local_endereco: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">DJ</label>
              <select
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                className="w-full p-2 rounded bg-white/10 text-white"
              >
                <option value="">Selecione...</option>
                {djs.map((dj) => (
                  <option key={dj.id} value={dj.id} className="bg-gray-900">
                    {dj.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Valor do Cachê
              </label>
              <input
                type="number"
                value={form.valor_cache}
                onChange={(e) =>
                  setForm({ ...form, valor_cache: parseFloat(e.target.value) || 0 })
                }
                className="w-full p-2 rounded bg-white/10 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="compartilhado-create"
                checked={form.compartilhado}
                onChange={(e) => setForm({ ...form, compartilhado: e.target.checked })}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="compartilhado-create" className="text-gray-300 text-sm">
                Compartilhar com o DJ selecionado
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => {
                  setCreatingNewEvent(false)
                  resetForm()
                }}
                className="px-4 py-2 text-gray-300"
              >
                Cancelar
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateNewEvent}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
              >
                Criar Evento
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
