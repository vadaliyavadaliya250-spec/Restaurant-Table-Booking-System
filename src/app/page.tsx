'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { QrCode, ArrowRight, Utensils } from 'lucide-react'

export default function HomePage() {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [menuUrl, setMenuUrl] = useState<string>('')

  useEffect(() => {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL
    const currentUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const baseUrl = envUrl || currentUrl
    const url = `${baseUrl}/menu`
    setMenuUrl(url)

    import('qrcode').then((QRCode) => {
      QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        width: 320,
        margin: 2,
        color: { dark: '#1A0F08', light: '#FDFAF5' },
      }).then(setQrDataUrl)
    })
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{ background: 'linear-gradient(135deg, #1A0F08 0%, #2C1810 50%, #1A0F08 100%)' }}>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #B8933A 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #B8933A 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }} className="relative z-10 max-w-lg w-full">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="h-px w-12 opacity-60" style={{ background: '#B8933A' }} />
            <Utensils size={16} style={{ color: '#B8933A' }} />
            <div className="h-px w-12 opacity-60" style={{ background: '#B8933A' }} />
          </div>
          <h1 className="text-6xl font-light tracking-wide mb-3"
            style={{ fontFamily: 'Georgia, serif', color: '#FDFAF5', lineHeight: 1.1 }}>
            The Aurelius
          </h1>
          <p className="text-sm tracking-[0.3em] uppercase font-light" style={{ color: '#B8933A' }}>
            Culinary Excellence Since 1923
          </p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="rounded-2xl p-8 mb-8 text-center" style={{ background: '#FDFAF5' }}>
          <p className="text-xs tracking-[0.25em] uppercase mb-6 font-medium" style={{ color: '#B8933A' }}>
            Scan to View Menu
          </p>

          {qrDataUrl ? (
            <div className="inline-block p-4 rounded-xl mb-6" style={{ background: '#F5E8D0' }}>
              <img src={qrDataUrl} alt="Menu QR Code" className="w-56 h-56" />
            </div>
          ) : (
            <div className="w-56 h-56 mx-auto mb-6 rounded-xl animate-pulse flex items-center justify-center"
              style={{ background: '#F5E8D0' }}>
              <QrCode size={32} style={{ color: '#B8933A' }} className="opacity-50" />
            </div>
          )}

          <p className="text-xs mb-4 opacity-60" style={{ color: '#2C1810' }}>
            Point your phone camera at the QR code to open the menu
          </p>
          <div className="pt-4 border-t" style={{ borderColor: '#EDD5B0' }}>
            <p className="font-mono break-all" style={{ color: '#B8933A', fontSize: '0.65rem' }}>
              {menuUrl}
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/menu" className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium text-sm"
            style={{ background: 'linear-gradient(135deg, #B8933A 0%, #D4AF6A 100%)', color: '#1A0F08' }}>
            Open Menu <ArrowRight size={16} />
          </Link>
          <Link href="/admin" className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium text-sm"
            style={{ background: 'rgba(253,250,245,0.08)', border: '1px solid rgba(184,147,58,0.3)', color: '#FDFAF5' }}>
            Admin Panel
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
