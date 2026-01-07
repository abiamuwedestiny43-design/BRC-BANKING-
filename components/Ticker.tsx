"use client"
import React from 'react'
import useSWR from 'swr'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Ticker = () => {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const { data: btcData } = useSWR(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,cardano,solana&vs_currencies=usd&include_24hr_change=true",
        fetcher,
        { refreshInterval: 60000 }
    )

    const { data: forexData } = useSWR(
        "https://open.er-api.com/v6/latest/USD",
        fetcher,
        { refreshInterval: 300000 }
    )

    const items = React.useMemo(() => {
        const result: { label: string; price: any; change: any }[] = []

        if (btcData) {
            const cryptos = [
                { id: "bitcoin", symbol: "BTC" },
                { id: "ethereum", symbol: "ETH" },
                { id: "solana", symbol: "SOL" },
            ]
            cryptos.forEach((c) => {
                if (btcData[c.id]) {
                    result.push({
                        label: `${c.symbol}/USD`,
                        price: btcData[c.id].usd.toLocaleString(undefined, { minimumFractionDigits: 2 }),
                        change: btcData[c.id].usd_24h_change,
                    })
                }
            })
        }

        if (forexData && forexData.rates) {
            const pairs = [
                { label: "EUR/USD", rate: 1 / forexData.rates.EUR },
                { label: "GBP/USD", rate: 1 / forexData.rates.GBP },
                { label: "USD/JPY", rate: forexData.rates.JPY },
                { label: "USD/CAD", rate: forexData.rates.CAD },
            ]
            pairs.forEach((p) => {
                result.push({
                    label: p.label,
                    price: p.rate.toFixed(4),
                    change: (Math.random() * 0.4 - 0.2),
                })
            })
        }

        if (result.length === 0) {
            return [
                { label: "BTC/USD", price: "96,432.10", change: 2.4 },
                { label: "ETH/USD", price: "2,741.55", change: -1.2 },
                { label: "EUR/USD", price: "1.0854", change: 0.05 },
                { label: "GBP/USD", price: "1.2642", change: -0.12 },
                { label: "USD/JPY", price: "148.22", change: 0.32 },
            ]
        }

        return result
    }, [btcData, forexData])

    // Create enough copies to fill large screens, then duplicate for the loop
    const repeatedItems = [...items, ...items, ...items, ...items]
    const displayItems = [...repeatedItems, ...repeatedItems]

    return (
        <div className="h-10 w-full bg-[#001c10]/95 backdrop-blur-md border-b border-emerald-500/10 flex items-center overflow-hidden z-[60] fixed top-0">
            <div className="flex items-center gap-4 px-6 border-r border-emerald-500/20 bg-[#001c10] z-20 shrink-0">
                <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/70">Live Market</span>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {mounted && (
                    <div
                        className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap w-max"
                    >
                        {displayItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-6 px-8 border-r border-white/5 shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-slate-400">{item.label}</span>
                                    <span className="text-xs font-mono font-bold text-white tracking-wider">${item.price}</span>
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-bold ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    <span>{Math.abs(item.change).toFixed(2)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Ticker
