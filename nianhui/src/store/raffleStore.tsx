import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Participant = {
  id: string
  name: string
}

export type Prize = {
  id: string
  name: string
  description: string
  image: string
}

export type Rule = {
  prizeName: string
  winnerCount: number
  removeWinner: boolean
}

export type Rarity = "R" | "SR" | "SSR"

export type DrawCard = {
  id: string
  winner?: string
  prizeName: string
  description: string
  image: string
  rarity: Rarity
}

export type DrawSession = {
  id: string
  time: string
  cards: DrawCard[]
}

type RaffleState = {
  participants: Participant[]
  prizes: Prize[]
  rule: Rule
  sessions: DrawSession[]
  lastSession: DrawSession | null
  selectedCard: DrawCard | null
  addParticipant: (name: string) => void
  addParticipants: (names: string[]) => void
  addPrize: (name: string) => void
  addPrizes: (names: string[]) => void
  updateRule: (partial: Partial<Rule>) => void
  drawTen: () => DrawSession
  setSelectedCard: (card: DrawCard | null) => void
  resetAll: () => void
}

const STORAGE_KEY = "nianhui-raffle-v1"

const placeholderPrize = {
  description: "年度限定奖品，占位描述。",
  image: "/placeholder-prize.svg",
}

const defaultRule: Rule = {
  prizeName: "年度大奖",
  winnerCount: 10,
  removeWinner: true,
}

const RaffleContext = createContext<RaffleState | null>(null)

const createId = () => (typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now()))

const rarityPool: { rarity: Rarity; weight: number }[] = [
  { rarity: "SSR", weight: 6 },
  { rarity: "SR", weight: 18 },
  { rarity: "R", weight: 76 },
]

function pickRarity() {
  const roll = Math.random() * 100
  let sum = 0
  for (const item of rarityPool) {
    sum += item.weight
    if (roll <= sum) return item.rarity
  }
  return "R"
}

function loadState() {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as {
      participants: Participant[]
      prizes: Prize[]
      rule: Rule
      sessions: DrawSession[]
    }
  } catch (error) {
    console.warn("Failed to parse raffle state", error)
    return null
  }
}

export function RaffleProvider({ children }: { children: React.ReactNode }) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [rule, setRule] = useState<Rule>(defaultRule)
  const [sessions, setSessions] = useState<DrawSession[]>([])
  const [selectedCard, setSelectedCard] = useState<DrawCard | null>(null)

  useEffect(() => {
    const stored = loadState()
    if (!stored) return
    setParticipants(stored.participants || [])
    setPrizes(stored.prizes || [])
    setRule(stored.rule || defaultRule)
    setSessions(stored.sessions || [])
  }, [])

  useEffect(() => {
    const payload = JSON.stringify({
      participants,
      prizes,
      rule,
      sessions,
    })
    window.localStorage.setItem(STORAGE_KEY, payload)
  }, [participants, prizes, rule, sessions])

  const addParticipant = (name: string) => {
    const clean = name.trim()
    if (!clean) return
    setParticipants((prev) => {
      if (prev.some((item) => item.name === clean)) return prev
      return [...prev, { id: createId(), name: clean }]
    })
  }

  const addParticipants = (names: string[]) => {
    const cleaned = names.map((name) => name.trim()).filter(Boolean)
    if (!cleaned.length) return
    setParticipants((prev) => {
      const existing = new Set(prev.map((item) => item.name))
      const next = cleaned
        .filter((name) => !existing.has(name))
        .map((name) => ({ id: createId(), name }))
      return [...prev, ...next]
    })
  }

  const addPrize = (name: string) => {
    const clean = name.trim()
    if (!clean) return
    setPrizes((prev) => {
      if (prev.some((item) => item.name === clean)) return prev
      return [
        ...prev,
        {
          id: createId(),
          name: clean,
          description: placeholderPrize.description,
          image: placeholderPrize.image,
        },
      ]
    })
  }

  const addPrizes = (names: string[]) => {
    const cleaned = names.map((name) => name.trim()).filter(Boolean)
    if (!cleaned.length) return
    setPrizes((prev) => {
      const existing = new Set(prev.map((item) => item.name))
      const next = cleaned
        .filter((name) => !existing.has(name))
        .map((name) => ({
          id: createId(),
          name,
          description: placeholderPrize.description,
          image: placeholderPrize.image,
        }))
      return [...prev, ...next]
    })
  }

  const updateRule = (partial: Partial<Rule>) => {
    setRule((prev) => ({ ...prev, ...partial }))
  }

  const drawTen = () => {
    const basePrize =
      prizes.length > 0
        ? prizes
        : [
            {
              id: "placeholder",
              name: rule.prizeName || "年度大奖",
              description: placeholderPrize.description,
              image: placeholderPrize.image,
            },
          ]

    const pool = [...participants]
    const winnerCount = Math.min(rule.winnerCount, 10, pool.length || 0)
    const winnerSlots = new Set<number>()
    while (winnerSlots.size < winnerCount) {
      winnerSlots.add(Math.floor(Math.random() * 10))
    }

    const cards: DrawCard[] = Array.from({ length: 10 }).map((_, index) => {
      const isWinner = winnerSlots.has(index) && pool.length
      const winner = isWinner
        ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0]?.name
        : undefined
      const prize = basePrize[Math.floor(Math.random() * basePrize.length)]
      return {
        id: createId(),
        winner,
        prizeName: isWinner ? prize?.name || rule.prizeName || "年度大奖" : "感谢参与",
        description: prize?.description || placeholderPrize.description,
        image: prize?.image || placeholderPrize.image,
        rarity: isWinner ? pickRarity() : "R",
      }
    })

    if (rule.removeWinner && participants.length) {
      const winnerNames = new Set(cards.map((card) => card.winner).filter(Boolean))
      setParticipants((prev) => prev.filter((item) => !winnerNames.has(item.name)))
    }

    const session: DrawSession = {
      id: createId(),
      time: new Date().toLocaleString(),
      cards,
    }
    setSessions((prev) => [session, ...prev])
    setSelectedCard(cards[0] || null)
    return session
  }

  const resetAll = () => {
    setParticipants([])
    setPrizes([])
    setRule(defaultRule)
    setSessions([])
    setSelectedCard(null)
  }

  const value = useMemo<RaffleState>(
    () => ({
      participants,
      prizes,
      rule,
      sessions,
      lastSession: sessions[0] ?? null,
      selectedCard,
      addParticipant,
      addParticipants,
      addPrize,
      addPrizes,
      updateRule,
      drawTen,
      setSelectedCard,
      resetAll,
    }),
    [participants, prizes, rule, sessions, selectedCard]
  )

  return <RaffleContext.Provider value={value}>{children}</RaffleContext.Provider>
}

export function useRaffleStore() {
  const ctx = useContext(RaffleContext)
  if (!ctx) {
    throw new Error("useRaffleStore must be used within RaffleProvider")
  }
  return ctx
}
