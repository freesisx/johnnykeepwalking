import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import type { DrawSession } from "../store/raffleStore"
import { useRaffleStore } from "../store/raffleStore"

const rarityColor: Record<string, string> = {
  R: "text-[#ad92c9]",
  SR: "text-primary",
  SSR: "text-[#ffd700]",
}

export default function TenPull() {
  const navigate = useNavigate()
  const { lastSession, drawTen, setSelectedCard } = useRaffleStore()
  const [session, setSession] = useState<DrawSession | null>(lastSession)
  const [revealed, setRevealed] = useState<number[]>([])
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    if (lastSession) setSession(lastSession)
  }, [lastSession])

  const cards = useMemo(() => session?.cards ?? Array.from({ length: 10 }), [session])

  const triggerReveal = (nextSession: DrawSession) => {
    setRevealed([])
    nextSession.cards.forEach((_, index) => {
      setTimeout(() => {
        setRevealed((prev) => (prev.includes(index) ? prev : [...prev, index]))
        const target = cardRefs.current[index]
        if (target) {
          gsap.fromTo(
            target,
            { rotateY: 90, scale: 0.9 },
            { rotateY: 0, scale: 1, duration: 0.6, ease: "power3.out" }
          )
        }
      }, 120 * index)
    })
  }

  const handleDraw = () => {
    const nextSession = drawTen()
    setSession(nextSession)
    triggerReveal(nextSession)
  }

  const handleReveal = () => {
    if (!session) return
    triggerReveal(session)
  }

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/card-back-sprite.png')" }}
      >
        <div className="absolute inset-0 bg-[#0a0510]/80 backdrop-blur-[2px]"></div>
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex-none px-8 py-6 flex flex-wrap justify-between items-center max-w-[1400px] w-full mx-auto gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-[32px] font-bold tracking-tight leading-tight drop-shadow-lg">
              获得物品
            </h1>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffd700] text-sm">auto_awesome</span>
              <p className="text-[#ad92c9] text-sm font-medium">
                {session ? "本轮抽取完成，准备揭晓！" : "暂无抽奖记录"}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-3 bg-[#2d1b4e]/80 border border-[#4d3267] rounded-full px-4 py-2 backdrop-blur-md">
              <span className="material-symbols-outlined text-[#ad92c9]">payments</span>
              <div className="flex flex-col leading-none">
                <span className="text-xs text-[#ad92c9] uppercase tracking-wider font-bold">
                  抽奖批次
                </span>
                <span className="text-white font-bold">{session ? "最新" : "--"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[#2d1b4e]/80 border border-[#4d3267] rounded-full px-4 py-2 backdrop-blur-md">
              <span className="material-symbols-outlined text-primary">diamond</span>
              <div className="flex flex-col leading-none">
                <span className="text-xs text-[#ad92c9] uppercase tracking-wider font-bold">
                  十连结果
                </span>
                <span className="text-white font-bold">{session ? "10" : "0"}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 md:px-12 w-full max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6 w-full pb-8">
            {cards.map((_, index) => {
              const isRevealed = revealed.includes(index)
              const data = session?.cards[index]
              const rarity = data?.rarity ?? "R"
              return (
                <button
                  key={data?.id ?? index}
                  ref={(el) => {
                    cardRefs.current[index] = el
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className={`group relative flex flex-col border border-[#4d3267] rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl aspect-[2/3] text-left ${
                    isRevealed ? "bg-[#1a1122]/90" : "bg-[#0f0b16]/80"
                  } ${rarity === "SSR" && isRevealed ? "legendary-card" : ""}`}
                  onClick={() => {
                    if (data) {
                      setSelectedCard(data)
                      navigate("/roles")
                    }
                  }}
                >
                  {!isRevealed && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center mystery-card-back card-back-crop">
                      <div className="mystery-core"></div>
                      <div className="mystery-rune">✦</div>
                      <div className="mystery-border-decoration"></div>
                      <div className="mystery-corner" style={{ top: 8, left: 8 }}></div>
                      <div
                        className="mystery-corner"
                        style={{ top: 8, right: 8, transform: "rotate(90deg)" }}
                      ></div>
                      <div
                        className="mystery-corner"
                        style={{ bottom: 8, left: 8, transform: "rotate(-90deg)" }}
                      ></div>
                      <div
                        className="mystery-corner"
                        style={{ bottom: 8, right: 8, transform: "rotate(180deg)" }}
                      ></div>
                      <div className="absolute bottom-4 text-xs text-white/70 tracking-widest">
                        点击揭晓
                      </div>
                    </div>
                  )}

                  {isRevealed && data && (
                    <>
                      <div
                        className={`absolute top-2 right-2 bg-black/60 rounded px-2 py-0.5 text-xs font-bold z-10 backdrop-blur-sm ${rarityColor[rarity]}`}
                      >
                        {rarity}
                      </div>
                      <div
                        className="h-full w-full bg-cover bg-center opacity-90 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundImage: `url('${data.image}')` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1122] via-transparent to-transparent"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <p className="text-white text-sm font-bold truncate">{data.prizeName}</p>
                        <p className="text-xs text-white/70 mt-1">
                          {data.winner ? `获奖者：${data.winner}` : "等待抽取"}
                        </p>
                      </div>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </main>

        <footer className="flex-none pb-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleReveal}
              className="px-6 h-12 rounded-full bg-white/10 border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition"
            >
              翻开奖励
            </button>
            <button
              onClick={handleDraw}
              className="px-8 h-12 rounded-full bg-primary text-white font-bold hover:bg-primary-glow transition shadow-[0_0_30px_rgba(127,19,236,0.4)]"
            >
              再来一次
            </button>
            <button
              onClick={() => navigate("/roles")}
              className="px-6 h-12 rounded-full bg-white/10 border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition"
            >
              查看奖品详情
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
