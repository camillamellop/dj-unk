"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  Receipt,
  Target,
  CreditCard,
  Wallet,
  PieChart,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Music,
  Home,
  Wifi,
  Smartphone,
  Car,
  Coffee,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"

// --- TypeScript Interfaces ---
interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  description: string
  amount: number
  date: string
  isRecurring: boolean
  gigId?: string
}

interface FinancialGoal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
}

interface Cache {
  id: string
  eventTitle: string
  amount: number
  date: string
  producer: string
  status: "pending" | "paid" | "overdue"
  paymentProof?: string
}

// --- Expense Category Configuration ---
const expenseCategories = [
  { name: "Moradia", icon: Home, color: "text-blue-400" },
  { name: "Internet", icon: Wifi, color: "text-green-400" },
  { name: "Equipamento", icon: Music, color: "text-purple-400" },
  { name: "Streaming", icon: Smartphone, color: "text-pink-400" },
  { name: "Transporte", icon: Car, color: "text-yellow-400" },
  { name: "Alimentação", icon: Coffee, color: "text-orange-400" },
]

type ActiveTab = "overview" | "caches" | "transactions" | "expenses" | "goals"

export default function Unkash() {
  // --- Component State ---
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview")
  const [showAddForm, setShowAddForm] = useState(false)
  const [showBalances, setShowBalances] = useState(true)

  // Data states, initialized as empty arrays
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [caches, setCaches] = useState<Cache[]>([])
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [loading, setLoading] = useState(true)

  // State for the new transaction form
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: "expense",
    category: "",
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    isRecurring: false,
  })

  // --- Data Fetching Effect ---
  useEffect(() => {
    // Fetch all data from Supabase when the component mounts
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchTransactions(), fetchCaches(), fetchGoals()])
      setLoading(false)
    }
    fetchData()
  }, [])

  // --- Supabase Data Fetching Functions ---
  const fetchTransactions = async () => {
    const { data, error } = await supabase.from("transactions").select("*")
    if (error) console.error("Error fetching transactions:", error)
    else setTransactions(data || [])
  }

  const fetchCaches = async () => {
    const { data, error } = await supabase.from("caches").select("*")
    if (error) console.error("Error fetching caches:", error)
    else setCaches(data || [])
  }

  const fetchGoals = async () => {
    const { data, error } = await supabase.from("financial_goals").select("*")
    if (error) console.error("Error fetching goals:", error)
    else setGoals(data || [])
  }

  // --- Supabase CRUD Functions ---
  const handleAddTransaction = async () => {
    if (newTransaction.description && newTransaction.amount && newTransaction.category) {
      const { data, error } = await supabase.from("transactions").insert([newTransaction]).select()

      if (error) {
        console.error("Error adding transaction:", error)
      } else if (data) {
        // Add the new transaction to the local state to update UI instantly
        setTransactions([...transactions, data[0]])
        // Reset the form
        setNewTransaction({
          type: "expense",
          category: "",
          description: "",
          amount: 0,
          date: new Date().toISOString().split("T")[0],
          isRecurring: false,
        })
        setShowAddForm(false)
      }
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    const { error } = await supabase.from("transactions").delete().match({ id })
    if (error) {
      console.error("Error deleting transaction:", error)
    } else {
      setTransactions(transactions.filter((t) => t.id !== id))
    }
  }

  // --- Helper Functions ---
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-400 bg-green-500/20"
      case "pending":
        return "text-yellow-400 bg-yellow-500/20"
      case "overdue":
        return "text-red-400 bg-red-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  // --- Calculated Values ---
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  const pendingCaches = caches.filter((c) => c.status === "pending").reduce((sum, c) => sum + c.amount, 0)
  const paidCaches = caches.filter((c) => c.status === "paid").reduce((sum, c) => sum + c.amount, 0)
  const overdueCaches = caches.filter((c) => c.status === "overdue").reduce((sum, c) => sum + c.amount, 0)

  // --- Render Logic ---
  if (loading) {
    return <div className="text-center text-gray-300">Carregando dados...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            Unkash
          </h1>
          <p className="text-gray-300">Controle financeiro completo</p>
        </div>
        <Button onClick={() => setShowBalances(!showBalances)} variant="ghost" className="text-gray-400">
          {showBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { id: "overview", label: "Visão Geral", icon: PieChart },
          { id: "caches", label: "Cachês", icon: Music },
          { id: "transactions", label: "Transações", icon: Receipt },
          { id: "expenses", label: "Gastos Fixos", icon: CreditCard },
          { id: "goals", label: "Metas", icon: Target },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center space-x-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-green-500/20 text-green-400 border-green-400"
                  : "border-gray-600 text-gray-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          )
        })}
      </div>

      ---

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard variant="music" className="text-center">
              <Wallet className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{showBalances ? formatCurrency(balance) : "••••••"}</p>
              <p className="text-gray-400 text-sm">Saldo Atual</p>
            </GlassCard>

            <GlassCard variant="music" className="text-center">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{showBalances ? formatCurrency(totalIncome) : "••••••"}</p>
              <p className="text-gray-400 text-sm">Receitas</p>
            </GlassCard>

            <GlassCard variant="music" className="text-center">
              <TrendingDown className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{showBalances ? formatCurrency(totalExpenses) : "••••••"}</p>
              <p className="text-gray-400 text-sm">Gastos</p>
            </GlassCard>

            <GlassCard variant="music" className="text-center">
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{showBalances ? formatCurrency(pendingCaches) : "••••••"}</p>
              <p className="text-gray-400 text-sm">Cachês Pendentes</p>
            </GlassCard>
          </div>

          {/* Recent Transactions */}
          <GlassCard variant="music">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Transações Recentes</h3>
              <Button
                onClick={() => setActiveTab("transactions")}
                variant="ghost"
                className="text-green-400 hover:text-green-300"
              >
                Ver Todas
              </Button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "income" ? "bg-green-500/20" : "bg-red-500/20"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-gray-400 text-sm">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.type === "income" ? "text-green-400" : "text-red-400"}`}>
                      {transaction.type === "income" ? "+" : "-"}
                      {showBalances ? formatCurrency(transaction.amount) : "••••••"}
                    </p>
                    <p className="text-gray-400 text-sm">{new Date(transaction.date).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Financial Goals Progress */}
          <GlassCard variant="music">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Progresso das Metas</h3>
              <Button
                onClick={() => setActiveTab("goals")}
                variant="ghost"
                className="text-green-400 hover:text-green-300"
              >
                Ver Todas
              </Button>
            </div>
            <div className="space-y-4">
              {goals.slice(0, 2).map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">{goal.title}</span>
                      <span className="text-green-400 text-sm">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{showBalances ? formatCurrency(goal.currentAmount) : "••••••"}</span>
                      <span>{showBalances ? formatCurrency(goal.targetAmount) : "••••••"}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>
      )}

      ---

      {/* Cachês Tab */}
      {activeTab === "caches" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Gerenciamento de Cachês</h3>
            <div className="flex space-x-2">
              <Badge className="bg-green-500/20 text-green-400">
                Pagos: {showBalances ? formatCurrency(paidCaches) : "••••••"}
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-400">
                Pendentes: {showBalances ? formatCurrency(pendingCaches) : "••••••"}
              </Badge>
              {overdueCaches > 0 && (
                <Badge className="bg-red-500/20 text-red-400">
                  Atrasados: {showBalances ? formatCurrency(overdueCaches) : "••••••"}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {caches.map((cache) => (
              <GlassCard key={cache.id} variant="music">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{cache.eventTitle}</h4>
                      <Badge className={getStatusColor(cache.status)}>
                        {cache.status === "paid" ? "Pago" : cache.status === "pending" ? "Pendente" : "Atrasado"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span>{showBalances ? formatCurrency(cache.amount) : "••••••"}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-green-400" />
                        <span>{new Date(cache.date).toLocaleDateString("pt-BR")}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Receipt className="w-4 h-4 text-green-400" />
                        <span>{cache.producer}</span>
                      </div>
                    </div>

                    {cache.paymentProof && (
                      <div className="mt-3 flex items-center space-x-2 text-sm text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Comprovante: {cache.paymentProof}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {cache.status === "pending" && (
                      <Button size="sm" className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                        <Upload className="w-4 h-4 mr-1" />
                        Upload Comprovante
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {cache.status === "overdue" && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm">
                        Pagamento em atraso - Entre em contato com o produtor
                      </span>
                    </div>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      ---

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Todas as Transações</h3>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-gradient-to-r from-green-500 to-emerald-500">
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </div>

          {/* Add Transaction Form */}
          {showAddForm && (
            <GlassCard variant="music">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-white">Nova Transação</h4>
                <Button variant="ghost" onClick={() => setShowAddForm(false)} className="text-gray-400 text-2xl">
                  &times;
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="type" className="text-gray-300">
                    Tipo
                  </Label>
                  <select
                    id="type"
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as "income" | "expense" })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="expense" className="bg-gray-800">
                      Gasto
                    </option>
                    <option value="income" className="bg-gray-800">
                      Receita
                    </option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="category" className="text-gray-300">
                    Categoria
                  </Label>
                  <Input
                    id="category"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Ex: Equipamento, Moradia..."
                  />
                </div>

                <div>
                  <Label htmlFor="amount" className="text-gray-300">
                    Valor (R$)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="text-gray-300">
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="description" className="text-gray-300">
                  Descrição
                </Label>
                <Input
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Descrição da transação"
                />
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <Switch
                  id="isRecurring"
                  checked={newTransaction.isRecurring}
                  onCheckedChange={(checked) => setNewTransaction({ ...newTransaction, isRecurring: checked })}
                />
                <Label htmlFor="isRecurring" className="text-gray-300">
                  Transação recorrente
                </Label>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleAddTransaction} className="bg-gradient-to-r from-green-500 to-emerald-500">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-gray-600 text-gray-400"
                >
                  Cancelar
                </Button>
              </div>
            </GlassCard>
          )}

          {/* Transactions List */}
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <GlassCard key={transaction.id} variant="music">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === "income" ? "bg-green-500/20" : "bg-red-500/20"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{transaction.category}</span>
                        <span>{new Date(transaction.date).toLocaleDateString("pt-BR")}</span>
                        {transaction.isRecurring && (
                          <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                            Recorrente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p
                      className={`text-lg font-semibold ${
                        transaction.type === "income" ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {showBalances ? formatCurrency(transaction.amount) : "••••••"}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDeleteTransaction(transaction.id)} size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      ---

      {/* Fixed Expenses Tab */}
      {activeTab === "expenses" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Gastos Fixos</h3>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
              <Plus className="w-4 h-4 mr-2" />
              Novo Gasto Fixo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseCategories.map((category) => {
              const Icon = category.icon
              const categoryExpenses = transactions.filter(
                (t) => t.type === "expense" && t.isRecurring && t.category === category.name,
              )
              const totalAmount = categoryExpenses.reduce((sum, t) => sum + t.amount, 0)

              return (
                <GlassCard key={category.name} variant="music">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{category.name}</h4>
                      <p className="text-gray-400 text-sm">{categoryExpenses.length} itens</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {categoryExpenses.map((expense) => (
                      <div key={expense.id} className="flex justify-between items-center bg-white/5 rounded-lg p-2">
                        <span className="text-gray-300 text-sm">{expense.description}</span>
                        <span className="text-red-400 font-medium">
                          {showBalances ? formatCurrency(expense.amount) : "••••••"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {totalAmount > 0 && (
                    <div className="border-t border-white/10 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">Total Mensal</span>
                        <span className="text-red-400 font-bold">
                          {showBalances ? formatCurrency(totalAmount) : "••••••"}
                        </span>
                      </div>
                    </div>
                  )}
                </GlassCard>
              )
            })}
          </div>
        </div>
      )}

      ---

      {/* Financial Goals Tab */}
      {activeTab === "goals" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Metas Financeiras</h3>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
              <Plus className="w-4 h-4 mr-2" />
              Nova Meta
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const daysLeft = Math.ceil(
                (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )

              return (
                <GlassCard key={goal.id} variant="music">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{goal.title}</h4>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        {goal.category}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">Progresso</span>
                        <span className="text-green-400 font-semibold">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Atual</p>
                        <p className="text-white font-semibold">
                          {showBalances ? formatCurrency(goal.currentAmount) : "••••••"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Meta</p>
                        <p className="text-white font-semibold">
                          {showBalances ? formatCurrency(goal.targetAmount) : "••••••"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{new Date(goal.deadline).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <span className={`font-medium ${daysLeft > 30 ? "text-green-400" : "text-yellow-400"}`}>
                        {daysLeft > 0 ? `${daysLeft} dias restantes` : "Prazo vencido"}
                      </span>
                    </div>

                    <Button className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Valor
                    </Button>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
