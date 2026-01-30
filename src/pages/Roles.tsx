import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useRaffleStore } from "../store/raffleStore"

export default function Roles() {
  const navigate = useNavigate()
  const { selectedCard, lastSession } = useRaffleStore()
  const current = useMemo(() => {
    if (selectedCard) return selectedCard
    return lastSession?.cards[0] ?? null
  }, [selectedCard, lastSession])

  if (!current) {
    return (
      <div className="min-h-screen bg-background-dark text-white flex flex-col items-center justify-center gap-4">
        <p className="text-white/70">暂无奖品详情，请先完成抽奖。</p>
        <button
          onClick={() => navigate("/10pull")}
          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold"
        >
          返回抽奖
        </button>
      </div>
    )
  }

  return (
    <div className="bg-background-dark font-body overflow-hidden min-h-screen w-screen flex items-center justify-center text-white">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute inset-[-50%] w-[200%] h-[200%] bg-god-rays opacity-20 animate-[spin_60s_linear_infinite] origin-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-background-dark opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-transparent to-background-dark/80"></div>
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] h-full grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 py-8">
        <div className="lg:col-span-7 relative flex flex-col justify-center items-center h-full pointer-events-none">
          <div className="absolute top-[10%] lg:top-[15%] left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={`star-${index}`}
                className="material-symbols-outlined text-rarity-gold text-4xl lg:text-5xl star-pulse"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                star
              </span>
            ))}
          </div>
          <div
            className="relative h-[60vh] lg:h-[85vh] w-full max-w-[800px] bg-contain bg-center bg-no-repeat z-10 transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url('${current.image}')` }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-80">
              <img
                alt={current.prizeName}
                className="h-full w-full object-contain drop-shadow-[0_0_25px_rgba(127,19,236,0.6)]"
                src={current.image}
                style={{
                  maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                }}
              />
            </div>
          </div>
          <div className="absolute bottom-0 w-3/4 h-20 bg-black/40 blur-xl rounded-[100%] z-0"></div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center h-full pointer-events-auto z-30">
          <div className="relative bg-background-dark/60 backdrop-blur-xl border border-white/10 rounded-xl p-8 lg:p-10 flex flex-col gap-6 box-shadow-glow overflow-y-auto max-h-[90vh]">
            <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white">
                  <span className="material-symbols-outlined text-lg">redeem</span>
                </div>
                <h3 className="text-primary text-sm font-bold tracking-widest uppercase">
                  {current.rarity} 级奖品
                </h3>
              </div>
              <h1 className="text-white text-5xl lg:text-6xl font-black leading-[0.9] tracking-tighter text-shadow-glow">
                {current.prizeName}
              </h1>
              <p className="text-gray-400 text-lg font-normal italic mt-2">
                {current.winner ? `获奖者：${current.winner}` : "待揭晓"}
              </p>
            </div>

            <div className="text-gray-300 text-base font-light leading-relaxed border-l-2 border-primary pl-4">
              {current.description}
            </div>

            <div className="flex flex-col gap-4 py-2">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest opacity-60">
                奖励属性 (占位)
              </h4>
              {[
                { label: "荣耀值", value: "85%", color: "from-purple-500 to-pink-500" },
                { label: "稀有度", value: "90%", color: "from-blue-500 to-cyan-400" },
                { label: "幸运值", value: "70%", color: "from-green-500 to-emerald-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-14 text-gray-400 font-bold text-xs">{item.label}</div>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color}`}
                      style={{ width: item.value }}
                    ></div>
                  </div>
                  <div className="w-12 text-white font-mono text-right text-sm">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate("/10pull")}
                className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white hover:border-white/30 transition"
              >
                返回抽奖
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold hover:bg-primary-glow transition"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
