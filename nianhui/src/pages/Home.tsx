import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Papa from "papaparse"
import { useRaffleStore } from "../store/raffleStore"

function parseCsvFile(file: File, onDone: (values: string[]) => void) {
  Papa.parse<string[]>(file, {
    skipEmptyLines: true,
    complete: (results) => {
      const values = results.data.flat().map((cell) => String(cell || "").trim())
      onDone(values.filter(Boolean))
    },
  })
}

export default function Home() {
  const navigate = useNavigate()
  const {
    participants,
    prizes,
    rule,
    addParticipant,
    addParticipants,
    addPrize,
    addPrizes,
    updateRule,
    drawTen,
    resetAll,
  } = useRaffleStore()
  const [nameInput, setNameInput] = useState("")
  const [prizeInput, setPrizeInput] = useState("")

  const handleStart = () => {
    drawTen()
    navigate("/10pull")
  }

  return (
    <div className="min-h-screen w-full bg-background-dark text-white overflow-hidden">
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-cosmic-gradient opacity-90"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse opacity-60"></div>
        <div
          className="absolute top-3/4 right-1/3 w-1 h-1 bg-gold rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-pulse opacity-50"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 flex h-screen w-full">
        <aside className="w-[340px] h-full glass-panel border-r border-white/5 flex flex-col gap-6 p-6 shrink-0 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase">
              iDOTOOLS
            </span>
            <h1 className="text-2xl font-bold tracking-tight">年会抽奖控制台</h1>
            <p className="text-white/50 text-sm">名单、奖品与抽奖规则集中配置。</p>
          </div>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide">设置名单</h2>
              <span className="text-xs text-white/40">人数 {participants.length}</span>
            </div>
            <div className="flex gap-2">
              <input
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                className="flex-1 rounded-full bg-surface-dark/80 border border-white/10 px-4 py-2 text-sm"
                placeholder="输入单个名字"
              />
              <button
                className="rounded-full bg-primary px-4 text-sm font-semibold hover:bg-primary-glow transition"
                onClick={() => {
                  addParticipant(nameInput)
                  setNameInput("")
                }}
              >
                添加
              </button>
            </div>
            <label className="text-xs text-white/50">导入 CSV 名单</label>
            <input
              type="file"
              accept=".csv"
              className="text-xs text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:text-white/70 hover:file:bg-primary/40"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                parseCsvFile(file, addParticipants)
                event.currentTarget.value = ""
              }}
            />
            <div className="flex flex-wrap gap-2">
              {participants.slice(0, 12).map((item) => (
                <span
                  key={item.id}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                >
                  {item.name}
                </span>
              ))}
              {participants.length > 12 && (
                <span className="text-xs text-white/40">+{participants.length - 12}</span>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide">导入奖品</h2>
              <span className="text-xs text-white/40">奖品 {prizes.length}</span>
            </div>
            <div className="flex gap-2">
              <input
                value={prizeInput}
                onChange={(event) => setPrizeInput(event.target.value)}
                className="flex-1 rounded-full bg-surface-dark/80 border border-white/10 px-4 py-2 text-sm"
                placeholder="输入单个奖品"
              />
              <button
                className="rounded-full bg-primary px-4 text-sm font-semibold hover:bg-primary-glow transition"
                onClick={() => {
                  addPrize(prizeInput)
                  setPrizeInput("")
                }}
              >
                添加
              </button>
            </div>
            <label className="text-xs text-white/50">导入 CSV 奖品</label>
            <input
              type="file"
              accept=".csv"
              className="text-xs text-white/60 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:text-white/70 hover:file:bg-primary/40"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                parseCsvFile(file, addPrizes)
                event.currentTarget.value = ""
              }}
            />
            <div className="flex flex-wrap gap-2">
              {prizes.slice(0, 8).map((item) => (
                <span
                  key={item.id}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                >
                  {item.name}
                </span>
              ))}
              {prizes.length > 8 && (
                <span className="text-xs text-white/40">+{prizes.length - 8}</span>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold tracking-wide">抽奖规则设计</h2>
            <label className="text-xs text-white/50">奖项名称</label>
            <input
              value={rule.prizeName}
              onChange={(event) => updateRule({ prizeName: event.target.value })}
              className="rounded-full bg-surface-dark/80 border border-white/10 px-4 py-2 text-sm"
              placeholder="年度大奖"
            />
            <label className="text-xs text-white/50">可中奖人数</label>
            <input
              type="number"
              min={1}
              max={50}
              value={rule.winnerCount}
              onChange={(event) => updateRule({ winnerCount: Number(event.target.value) || 1 })}
              className="rounded-full bg-surface-dark/80 border border-white/10 px-4 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-xs text-white/60">
              <input
                type="checkbox"
                checked={rule.removeWinner}
                onChange={(event) => updateRule({ removeWinner: event.target.checked })}
                className="accent-primary"
              />
              中奖者移除名单
            </label>
          </section>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={resetAll}
              className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 hover:text-white hover:border-white/30 transition"
            >
              清空配置
            </button>
          </div>
        </aside>

        <main className="flex-1 relative flex flex-col items-center justify-center p-8 overflow-hidden">
          <div className="absolute top-12 left-0 right-0 text-center z-20 flex flex-col items-center gap-2 animate-float">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold"></div>
              <span className="text-gold text-xs font-bold tracking-[0.2em] uppercase">
                年会限定
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-[0_0_25px_rgba(127,19,236,0.5)]">
              iDOTOOLS 年会抽奖
            </h2>
            <p className="text-primary-glow/80 text-sm md:text-base font-normal tracking-wide max-w-lg">
              让幸运之光聚焦舞台中央，开启十连抽卡般的心跳时刻。
            </p>
          </div>

          <div className="relative size-[360px] md:size-[520px] flex items-center justify-center mt-[-40px]">
            <div className="absolute inset-0 rounded-full border border-primary/30 animate-pulse-slow"></div>
            <div
              className="absolute inset-4 rounded-full border border-dashed border-gold/20 animate-spin-slow"
              style={{ animationDuration: "60s" }}
            ></div>
            <div className="relative size-[80%] rounded-full bg-black flex items-center justify-center overflow-hidden shadow-[0_0_100px_rgba(127,19,236,0.6)]">
              <div className="absolute inset-0 bg-portal-glow opacity-20 animate-spin-slow blur-3xl"></div>
              <div className="absolute inset-[4px] bg-[#0a0712] rounded-full overflow-hidden flex items-center justify-center z-10">
                <div className="absolute w-1/3 h-1/3 rounded-full bg-primary blur-2xl animate-pulse"></div>
                <div className="relative z-20 text-white/90 text-center">
                  <div className="text-3xl font-bold">START</div>
                  <div className="text-xs text-white/60 tracking-widest">TEN PULL</div>
                </div>
              </div>
              <div className="absolute inset-0 border-[3px] border-primary/40 rounded-full z-20"></div>
              <div className="absolute inset-[10%] border border-white/10 rounded-full z-20"></div>
            </div>
            <div className="absolute top-10 left-10 size-2 bg-gold rounded-full animate-float blur-[1px]"></div>
            <div
              className="absolute bottom-20 right-10 size-1.5 bg-primary-glow rounded-full animate-float blur-[1px]"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div className="absolute bottom-10 left-1/2 size-1 bg-white rounded-full animate-pulse blur-[0.5px]"></div>
          </div>

          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-6 z-30">
            <button
              onClick={handleStart}
              className="group relative flex items-center justify-center min-w-[320px] h-16 bg-primary hover:bg-primary-glow text-white rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(127,19,236,0.4)] hover:shadow-[0_0_60px_rgba(127,19,236,0.7)] hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <div className="relative flex items-center gap-3 px-8 z-10">
                <span className="material-symbols-outlined text-gold-dim group-hover:text-gold transition-colors drop-shadow-md">
                  diamond
                </span>
                <div className="flex flex-col items-start">
                  <span className="text-lg font-black tracking-wider leading-none">开启十连抽</span>
                  <span className="text-xs font-medium text-white/80 leading-none mt-1">
                    自动匹配 {rule.winnerCount} 名获奖者
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/50 transition-colors"></div>
            </button>
            <div className="flex items-center gap-3 text-white/30 text-xs font-medium tracking-wide">
              <span>当前名单：{participants.length || 0} 人</span>
              <span className="w-1 h-1 bg-white/10 rounded-full"></span>
              <span>奖品池：{prizes.length || 0} 个</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
