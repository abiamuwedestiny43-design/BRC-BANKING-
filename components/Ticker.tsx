"use client"
import React from 'react'
import useSWR from 'swr'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Fallback data
const initialData = [
    { label: "BTC/USD", price: 96432.10, change: 2.4 },
    { label: "ETH/USD", price: 2741.55, change: -1.2 },
    { label: "SOL/USD", price: 145.20, change: 5.4 },
    { label: "EUR/USD", price: 1.0854, change: 0.05 },
    { label: "GBP/USD", price: 1.2642, change: -0.12 },
    { label: "USD/JPY", price: 148.22, change: 0.32 },
]

const Ticker = () => {
    const [mounted, setMounted] = React.useState(false)
    const [marketData, setMarketData] = React.useState(initialData)

    const { data: btcData } = useSWR(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true",
        fetcher,
        { refreshInterval: 60000 }
    )

    const { data: forexData } = useSWR(
        "https://open.er-api.com/v6/latest/USD",
        fetcher,
        { refreshInterval: 300000 }
    )

    // Sync API data to local state
    React.useEffect(() => {
        if (!btcData && !forexData) return

        setMarketData(prev => {
            const newData = [...prev]

            if (btcData) {
                const cryptos = [
                    { id: "bitcoin", label: "BTC/USD" },
                    { id: "ethereum", label: "ETH/USD" },
                    { id: "solana", label: "SOL/USD" },
                ]
                cryptos.forEach(c => {
                    if (btcData[c.id]) {
                        const index = newData.findIndex(item => item.label === c.label)
                        if (index !== -1) {
                            newData[index] = {
                                ...newData[index],
                                price: btcData[c.id].usd,
                                change: btcData[c.id].usd_24h_change || newData[index].change
                            }
                        }
                    }
                })
            }

            if (forexData && forexData.rates) {
                const pairs = [
                    { label: "EUR/USD", rate: 1 / forexData.rates.EUR },
                    { label: "GBP/USD", rate: 1 / forexData.rates.GBP },
                    { label: "USD/JPY", rate: forexData.rates.JPY },
                ]
                pairs.forEach(p => {
                    const index = newData.findIndex(item => item.label === p.label)
                    if (index !== -1 && p.rate) {
                        newData[index] = {
                            ...newData[index],
                            price: p.rate,
                            change: newData[index].change // Keep simulated change for forex as API lacks it
                        }
                    }
                })
            }

            return newData
        })
    }, [btcData, forexData])

    // Simulate live ticks every second
    React.useEffect(() => {
        setMounted(true)
        const interval = setInterval(() => {
            setMarketData(prev => prev.map(item => {
                // Jitter price by max 0.05%
                const priceJitter = 1 + (Math.random() * 0.0005 - 0.00025)
                const newPrice = item.price * priceJitter

                // Jitter change percentage slightly
                const changeJitter = Math.random() * 0.02 - 0.01
                const newChange = item.change + changeJitter

                return {
                    ...item,
                    price: newPrice,
                    change: newChange
                }
            }))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const formatPrice = (price: number) => {
        if (price < 10) return price.toFixed(4)
        return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    // Create enough copies to fill large screens
    const repeatedItems = [...marketData, ...marketData, ...marketData, ...marketData, ...marketData]

    return (
        <div className="h-10 w-full bg-white/95 backdrop-blur-md border-b border-black/10 flex items-center overflow-hidden z-[60] fixed top-0">
            <div className="flex items-center gap-4 px-6 border-r border-black/10 bg-white z-20 shrink-0">
                <Activity className="w-4 h-4 text-black animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Live Market</span>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {mounted && (
                    <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap w-max">
                        {repeatedItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-6 px-8 border-r border-black/5 shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-slate-600">{item.label}</span>
                                    <span className="text-xs font-mono font-bold text-black tracking-wider">${formatPrice(item.price)}</span>
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-bold ${item.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
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
