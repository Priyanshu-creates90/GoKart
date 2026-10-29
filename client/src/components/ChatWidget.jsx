import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    HiOutlineChatBubbleLeftRight,
    HiXMark,
    HiPaperAirplane,
    HiOutlineSparkles,
} from 'react-icons/hi2'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { valideURLConvert } from '../utils/valideURLConvert'
import AddToCartButton from './AddToCartButton'

const SUGGESTIONS = [
    "Eatables under ₹100",
    "Do you have paneer?",
    "Cheapest cold drink",
]

const GREETING = {
    role: 'model',
    text: "Hi! I can look things up in the store — prices, what's in stock, or your past orders. What are you after?",
    products: [],
}

/** Compact product row — the full CardProduct is too wide for the panel. */
const ChatProduct = ({ product }) => {
    const url = `/product/${valideURLConvert(product.name)}-${product._id}`

    return (
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-2">
            <Link to={url} className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sunken p-1">
                <img
                    src={product.image?.[0]}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain"
                />
            </Link>

            <div className="min-w-0 flex-1">
                <Link to={url} className="line-clamp-1 text-xs font-medium text-fg hover:text-brand">
                    {product.name}
                </Link>
                <p className="text-[11px] text-fg-faint">{product.unit}</p>
                <p className="price text-xs">
                    {DisplayPriceInRupees(pricewithDiscount(product.price, product.discount))}
                </p>
            </div>

            <div className="shrink-0">
                {
                    Number(product.stock) > 0
                        ? <AddToCartButton data={product} />
                        : <span className="text-[11px] font-medium text-critical">Sold out</span>
                }
            </div>
        </div>
    )
}

const ChatWidget = () => {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([GREETING])
    const scrollRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, loading, open])

    useEffect(() => {
        if (open) inputRef.current?.focus()
    }, [open])

    const send = async (text) => {
        const question = (text ?? input).trim()
        if (!question || loading) return

        // last 6 turns for context — the server clamps this again
        const history = messages
            .filter(m => m !== GREETING)
            .slice(-6)
            .map(m => ({ role: m.role, text: m.text }))

        setMessages(prev => [...prev, { role: 'user', text: question, products: [] }])
        setInput("")
        setLoading(true)

        try {
            const response = await Axios({
                ...SummaryApi.chat,
                data: { message: question, history },
            })

            const { data: responseData } = response

            setMessages(prev => [...prev, {
                role: 'model',
                text: responseData?.data?.reply || responseData?.message || "Sorry, I didn't catch that.",
                products: responseData?.data?.products || [],
            }])
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'model',
                text: error?.response?.data?.message || "I couldn't reach the store just now. Try again in a moment.",
                products: [],
            }])
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        send()
    }

    return (
        <>
            {/* launcher — sits above the mobile cart bar */}
            {
                !open && (
                    <button
                        onClick={() => setOpen(true)}
                        aria-label="Open store assistant"
                        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-on shadow-pop transition-transform hover:scale-105 active:scale-95 lg:bottom-6 lg:right-6"
                    >
                        <HiOutlineChatBubbleLeftRight size={24} />
                    </button>
                )
            }

            {/* panel */}
            {
                open && (
                    <div className="fixed bottom-4 right-4 z-40 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm animate-rise flex-col overflow-hidden rounded-card border border-line bg-ground shadow-pop lg:right-6">

                        <div className="flex items-center justify-between gap-3 border-b border-line bg-ink px-4 py-3">
                            <div className="flex items-center gap-2.5">
                                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-brand-on">
                                    <HiOutlineSparkles size={16} />
                                </span>
                                <div>
                                    <p className="font-display text-sm font-semibold text-ink-50">Store assistant</p>
                                    <p className="text-[11px] text-ink-300">Ask about products, prices or orders</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Close assistant"
                                className="rounded-full p-1.5 text-ink-200 transition-colors hover:bg-white/10 hover:text-ink-50"
                            >
                                <HiXMark size={20} />
                            </button>
                        </div>

                        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto scrollbar-slim p-3">
                            {
                                messages.map((message, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                                            <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed
                                                ${message.role === 'user'
                                                    ? 'rounded-br-sm bg-brand text-brand-on'
                                                    : 'rounded-bl-sm border border-line bg-surface text-fg'}`}>
                                                {message.text}
                                            </p>
                                        </div>

                                        {
                                            message.products?.length > 0 && (
                                                <div className="space-y-2">
                                                    {message.products.map(product => (
                                                        <ChatProduct key={product._id} product={product} />
                                                    ))}
                                                </div>
                                            )
                                        }
                                    </div>
                                ))
                            }

                            {
                                loading && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3">
                                            {[0, 150, 300].map(delay => (
                                                <span
                                                    key={delay}
                                                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-fg-faint"
                                                    style={{ animationDelay: `${delay}ms` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            }

                            {
                                messages.length === 1 && !loading && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {SUGGESTIONS.map(suggestion => (
                                            <button
                                                key={suggestion}
                                                onClick={() => send(suggestion)}
                                                className="chip transition-colors hover:border-brand hover:text-brand"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )
                            }
                        </div>

                        <form onSubmit={handleSubmit} className="border-t border-line bg-surface p-3">
                            <div className="input-shell">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about the store…"
                                    maxLength={500}
                                    className="input-bare"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    aria-label="Send"
                                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-brand-on transition-opacity disabled:opacity-40"
                                >
                                    <HiPaperAirplane size={14} />
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }
        </>
    )
}

export default ChatWidget
