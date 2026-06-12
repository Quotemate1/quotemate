'use client'

import { useEffect, useRef } from 'react'

export default function HomeV2() {
  const heroRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const statsSectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const stat1Ref = useRef<HTMLParagraphElement>(null)
  const stat2Ref = useRef<HTMLParagraphElement>(null)
  const stat3Ref = useRef<HTMLParagraphElement>(null)
  const howRef = useRef<HTMLElement>(null)
  const creatorRef = useRef<HTMLElement>(null)
  const creatorHeadlineRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLElement>(null)
  const ctaHeadlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    let cleanup: (() => void) | undefined

    const loadAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // HERO FADE OUT + slight shrink as you scroll past
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          opacity: 0.3,
          scale: 0.96,
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'bottom 90%',
            end: 'bottom 30%',
            scrub: 1,
          }
        })
      }

      // STATS SECTION MATERIALISE (fade in from below as it enters viewport)
      if (statsSectionRef.current) {
        gsap.fromTo(statsSectionRef.current,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsSectionRef.current,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1,
            }
          }
        )
      }

      // WORD-BY-WORD HEADLINE REVEAL
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.reveal-word')
        gsap.fromTo(words,
          { opacity: 0, y: 24, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        )
      }

      // CARDS FADE IN + lift
      if (statsRef.current) {
        const cards = statsRef.current.querySelectorAll('.stat-card')
        gsap.fromTo(cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        )
      }

      // NUMBERS COUNT UP
      const animateNumber = (el: HTMLElement | null, target: number, suffix: string, isMoney: boolean) => {
        if (!el) return
        const counter = { val: 0 }
        gsap.to(counter, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            if (isMoney) {
              el.textContent = '$' + Math.floor(counter.val)
            } else {
              el.textContent = Math.floor(counter.val) + suffix
            }
          }
        })
      }

      animateNumber(stat1Ref.current, 60, 's', false)
      animateNumber(stat2Ref.current, 5, 'hrs+', false)
      animateNumber(stat3Ref.current, 0, '', true)

      // HOW IT WORKS - alternating fade-in with internal animations
      if (howRef.current) {
        const steps = howRef.current.querySelectorAll('.how-step')
        steps.forEach((step, index) => {
          // Container fade-in
          gsap.fromTo(step,
            { opacity: 0, y: 80 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: step,
                start: 'top 75%',
                once: true,
              }
            }
          )

          // Inner elements stagger animation
          const innerElements = step.querySelectorAll('h3, p, .pulse-target, ul li, .line-item-row')
          gsap.fromTo(innerElements,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.05,
              ease: 'power2.out',
              delay: 0.3,
              scrollTrigger: {
                trigger: step,
                start: 'top 75%',
                once: true,
              }
            }
          )
        })
      }

      // ABOUT THE CREATOR - line by line storytelling reveal
      if (creatorHeadlineRef.current) {
        const lines = creatorHeadlineRef.current.querySelectorAll('.creator-line')
        gsap.fromTo(lines,
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            stagger: 0.35,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: creatorHeadlineRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        )
      }

      if (creatorRef.current) {
        // Body paragraphs fade in
        const body = creatorRef.current.querySelector('.creator-body')
        if (body) {
          const paragraphs = body.querySelectorAll('p')
          gsap.fromTo(paragraphs,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: body,
                start: 'top 80%',
                once: true,
              }
            }
          )
        }

        // Signature - special handwritten reveal
        const signature = creatorRef.current.querySelector('.creator-signature')
        if (signature) {
          gsap.fromTo(signature,
            { opacity: 0, y: 30, rotate: -2 },
            {
              opacity: 1,
              y: 0,
              rotate: 0,
              duration: 1.5,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: signature,
                start: 'top 85%',
                once: true,
              }
            }
          )
        }
      }

      // FINAL CTA - line by line + supporting fade
      if (ctaHeadlineRef.current) {
        const lines = ctaHeadlineRef.current.querySelectorAll('.cta-line')
        gsap.fromTo(lines,
          { opacity: 0, y: 40, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            stagger: 0.25,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaHeadlineRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        )
      }

      if (ctaRef.current) {
        const ctaElements = ctaRef.current.querySelectorAll('.cta-sub, .cta-actions, .cta-trust')
        gsap.fromTo(ctaElements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            delay: 0.5,
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 75%',
              once: true,
            }
          }
        )
      }

      cleanup = () => {
        ScrollTrigger.getAll().forEach(t => t.kill())
      }
    }

    loadAnimations()

    return () => { if (cleanup) cleanup() }
  }, [])

  return (
    <main className="bg-[#0a0a0f] text-white min-h-screen overflow-x-hidden font-sans antialiased">
      <section ref={heroRef} className="relative min-h-screen flex flex-col px-6 pt-32 pb-16 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.06),transparent_60%)]" />

        <nav className="absolute top-0 left-0 right-0 z-20 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
            <span className="text-white font-semibold tracking-tight">SmokoHQ</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-stone-400">
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/login" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all">Sign in</a>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-10 items-center w-full">

            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-xs text-stone-300 font-medium tracking-wide">Free during beta — Aussie tradies welcome</span>
              </div>

              <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95] font-bold tracking-[-0.04em] mb-8">
                <span className="block text-stone-300">You take your smoko.</span>
                <span className="block bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                  We&apos;ll handle the quotes.
                </span>
              </h1>

              <p className="text-lg text-stone-400 max-w-xl lg:max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
                AI writes the whole quote in 60 seconds. Sends it. Chases it. Even turns it into an invoice when the job is done. So you can stay on the tools.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-12">
                <a href="/login" className="group relative px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full transition-all hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] hover:-translate-y-0.5">
                  <span className="relative z-10">Start Free</span>
                  <span className="absolute inset-0 rounded-full bg-amber-500 blur-xl opacity-50 group-hover:opacity-80 transition-opacity -z-10" />
                </a>
                <a href="#stats" className="px-8 py-4 text-stone-300 hover:text-white font-medium transition-colors flex items-center gap-2">
                  See it in action
                  <span className="text-stone-500">{`>`}</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-stone-500 uppercase tracking-widest">
                <span>Built in Sydney</span>
                <span className="w-1 h-1 rounded-full bg-stone-700" />
                <span>By a 17yo founder</span>
                <span className="w-1 h-1 rounded-full bg-stone-700" />
                <span>For Aussie tradies</span>
              </div>
            </div>

            <div className="relative w-full flex items-center justify-center min-h-[560px]">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2/3 h-2/3 bg-amber-500/30 blur-[100px] rounded-full" />
              </div>

              <div className="relative w-full max-w-[620px] z-10">
                <div className="relative bg-gradient-to-b from-stone-800 to-stone-900 rounded-t-2xl p-2 shadow-2xl border border-stone-700/50">
                  <div className="bg-[#0a0a0f] rounded-lg overflow-hidden">
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-900/80 border-b border-stone-800">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                      <div className="ml-4 px-3 py-0.5 bg-stone-800 rounded text-[10px] text-stone-400">smokohq.app/dashboard</div>
                    </div>
                    <div className="p-5 space-y-3 min-h-[440px]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-stone-500 uppercase tracking-wider">Good day Lucas</p>
                          <p className="text-base font-bold text-white mt-0.5">Your quotes</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="px-2.5 py-1 bg-stone-800 border border-stone-700 rounded-full text-[9px] text-stone-300">Refer mates</div>
                          <div className="px-2.5 py-1 bg-amber-500 rounded-full text-black text-[9px] font-semibold">+ New Quote</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-2">
                          <p className="text-[8px] text-stone-500 uppercase">Total</p>
                          <p className="text-base font-bold text-white">14</p>
                        </div>
                        <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-2">
                          <p className="text-[8px] text-stone-500 uppercase">Conversion</p>
                          <p className="text-base font-bold text-emerald-400">82%</p>
                        </div>
                        <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-2">
                          <p className="text-[8px] text-stone-500 uppercase">Won</p>
                          <p className="text-base font-bold text-amber-400">$24k</p>
                        </div>
                        <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-2">
                          <p className="text-[8px] text-stone-500 uppercase">Follow-ups</p>
                          <p className="text-base font-bold text-sky-400">9</p>
                        </div>
                      </div>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center justify-between bg-stone-900/40 px-3 py-1.5 rounded-lg border border-stone-800/50">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] font-mono text-stone-500">QUO-0004</span>
                            <span className="text-xs text-white truncate">Bathroom reno - Smith</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full">Convert</span>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-full">Accepted</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-stone-900/40 px-3 py-1.5 rounded-lg border border-stone-800/50">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] font-mono text-stone-500">QUO-0003</span>
                            <span className="text-xs text-white truncate">Kitchen tap install</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-sky-950 text-sky-400 rounded-full flex-shrink-0">Sent</span>
                        </div>
                        <div className="flex items-center justify-between bg-stone-900/40 px-3 py-1.5 rounded-lg border border-stone-800/50">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[10px] font-mono text-stone-500">QUO-0002</span>
                            <span className="text-xs text-white truncate">Deck build - Jones</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-full flex-shrink-0">Accepted</span>
                        </div>
                      </div>
                      <div className="pt-3 mt-3 border-t border-stone-800/60">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold text-white">Invoices</p>
                          <div className="text-right">
                            <p className="text-[8px] text-stone-500 uppercase">Outstanding</p>
                            <p className="text-sm font-bold text-amber-400">$3,420</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between bg-stone-900/40 px-3 py-1.5 rounded-lg border border-stone-800/50">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[10px] font-mono text-stone-500">INV-0002</span>
                              <span className="text-xs text-white truncate">Bathroom reno</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[10px] text-stone-400">14 Jun</span>
                              <span className="text-[10px] px-2 py-0.5 bg-amber-950 text-amber-400 rounded-full">Unpaid</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between bg-stone-900/40 px-3 py-1.5 rounded-lg border border-stone-800/50">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[10px] font-mono text-stone-500">INV-0001</span>
                              <span className="text-xs text-white truncate">Deck build</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[10px] text-stone-400">02 Jun</span>
                              <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-full">Paid</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative h-3 bg-gradient-to-b from-stone-700 to-stone-900 rounded-b-2xl shadow-xl">
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-1 bg-stone-950 rounded-b-lg" />
                </div>
              </div>

              <div className="absolute -right-2 -bottom-16 lg:-right-4 lg:-bottom-8 w-52 lg:w-64 z-20">
                <div className="relative bg-gradient-to-b from-stone-800 to-stone-900 rounded-[2.5rem] p-2 shadow-[0_30px_80px_rgba(0,0,0,0.6)] border border-stone-700/50 rotate-3">
                  <div className="bg-white rounded-[2rem] overflow-hidden">
                    <div className="relative h-6 bg-white">
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-stone-900 rounded-full" />
                    </div>
                    <div className="bg-stone-900 px-4 py-3">
                      <p className="text-[8px] text-amber-400 font-bold uppercase tracking-widest">Tax Invoice</p>
                      <p className="text-xs font-bold text-white mt-1">Smith Plumbing</p>
                      <p className="text-[8px] text-stone-400 mt-0.5">QUO-0004 - $1,840.00 inc GST</p>
                      <p className="text-[7px] text-stone-500 mt-0.5">ABN 12 345 678 901</p>
                    </div>
                    <div className="p-3 space-y-2 bg-white">
                      <div>
                        <p className="text-[7px] text-stone-500 uppercase tracking-wider font-semibold">Quote for</p>
                        <p className="text-[10px] font-semibold text-stone-900">Sarah Henderson</p>
                        <p className="text-[8px] text-stone-500">14 Marlin St, Manly NSW</p>
                      </div>
                      <div>
                        <p className="text-[7px] text-emerald-600 uppercase tracking-wider font-bold">Scope of work</p>
                        <p className="text-[8px] text-stone-700 leading-tight mt-0.5">Full bathroom renovation including demo, waterproofing, tiling, and fixture install. 3-4 days on site.</p>
                      </div>
                      <div className="space-y-0.5 pt-1 border-t border-stone-100">
                        <div className="flex justify-between text-[8px] text-stone-700"><span>Demo and removal</span><span className="font-semibold">$320</span></div>
                        <div className="flex justify-between text-[8px] text-stone-700"><span>Waterproofing</span><span className="font-semibold">$480</span></div>
                        <div className="flex justify-between text-[8px] text-stone-700"><span>Tiling and grouting</span><span className="font-semibold">$540</span></div>
                        <div className="flex justify-between text-[8px] text-stone-700"><span>Fixtures and install</span><span className="font-semibold">$333</span></div>
                      </div>
                      <div className="bg-stone-50 rounded p-2 space-y-0.5">
                        <div className="flex justify-between text-[8px] text-stone-600"><span>Subtotal</span><span>$1,673</span></div>
                        <div className="flex justify-between text-[8px] text-stone-600"><span>GST (10%)</span><span>$167</span></div>
                        <div className="flex justify-between text-[10px] font-bold text-stone-900 pt-1 border-t border-stone-200"><span>Total</span><span>$1,840</span></div>
                      </div>
                      <div className="bg-emerald-500 text-white text-[9px] font-bold text-center py-2.5 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)]">Accept Quote</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>


        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none animate-bounce">
          <span className="text-[10px] text-stone-400 uppercase tracking-[0.3em] font-medium">Scroll to see more</span>
          <div className="w-5 h-9 border-2 border-stone-600 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          </div>
        </div>

      </section>

      <section ref={statsSectionRef} id="stats" className="relative px-6 py-32 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto">

          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span className="text-xs text-stone-300 font-medium tracking-wide uppercase">Built for tradies</span>
            </div>

            <h2 ref={headlineRef} className="text-[clamp(2rem,4.5vw,4rem)] leading-[1.05] font-bold tracking-[-0.03em] mb-6 max-w-3xl mx-auto">
              <span className="text-stone-200">
                <span className="reveal-word inline-block">Faster</span>{' '}
                <span className="reveal-word inline-block">quotes.</span>
              </span>
              <br />
              <span className="bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                <span className="reveal-word inline-block">More</span>{' '}
                <span className="reveal-word inline-block">time</span>{' '}
                <span className="reveal-word inline-block">on</span>{' '}
                <span className="reveal-word inline-block">the</span>{' '}
                <span className="reveal-word inline-block">tools.</span>
              </span>
            </h2>

            <p className="text-base md:text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed font-light">
              The numbers tradies care about. Not vanity metrics — the kind that show up in your week.
            </p>
          </div>

          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="stat-card group relative bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-8 hover:border-amber-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent rounded-2xl transition-all" />
              <div className="relative">
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.25em] mb-3">Speed</p>
                <p ref={stat1Ref} className="text-5xl md:text-6xl font-bold tracking-tighter mb-2 bg-gradient-to-br from-white to-stone-400 bg-clip-text text-transparent">0s</p>
                <p className="text-sm text-stone-400 leading-relaxed">From job description to a full quote your customer can actually read.</p>
              </div>
            </div>

            <div className="stat-card group relative bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-8 hover:border-amber-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent rounded-2xl transition-all" />
              <div className="relative">
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.25em] mb-3">Time back</p>
                <p ref={stat2Ref} className="text-5xl md:text-6xl font-bold tracking-tighter mb-2 bg-gradient-to-br from-white to-stone-400 bg-clip-text text-transparent">0hrs+</p>
                <p className="text-sm text-stone-400 leading-relaxed">Saved per week. That&apos;s half your weekend back.</p>
              </div>
            </div>

            <div className="stat-card group relative bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-8 hover:border-amber-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent rounded-2xl transition-all" />
              <div className="relative">
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.25em] mb-3">Cost</p>
                <p ref={stat3Ref} className="text-5xl md:text-6xl font-bold tracking-tighter mb-2 bg-gradient-to-br from-white to-stone-400 bg-clip-text text-transparent">$0</p>
                <p className="text-sm text-stone-400 leading-relaxed">Free while we&apos;re in beta. No card. No catch. Just honest feedback.</p>
              </div>
            </div>

          </div>

        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />
      </section>

<section ref={howRef} id="how" className="relative px-6 py-32 overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.06),transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto">

          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span className="text-xs text-stone-300 font-medium tracking-wide uppercase">How it works</span>
            </div>

            <h2 className="text-[clamp(2rem,4.5vw,4rem)] leading-[1.05] font-bold tracking-[-0.03em] mb-6 max-w-3xl mx-auto">
              <span className="text-stone-200">Three steps.</span>
              <br />
              <span className="bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">Sixty seconds.</span>
            </h2>

            <p className="text-base md:text-lg text-stone-400 max-w-2xl mx-auto leading-relaxed font-light">
              From a few words to a sent quote your customer can accept on their phone.
            </p>
          </div>

          <div className="space-y-32">

            {/* STEP 1 — LEFT TEXT, RIGHT VISUAL */}
            <div className="how-step grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-sm mb-6">01</div>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
                  Type the job<span className="text-amber-400">.</span>
                </h3>
                <p className="text-lg text-stone-400 leading-relaxed font-light max-w-md">
                  Like you would scribble on a smoko break. Three words or three sentences — both work. Our AI fills in the rest.
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-3xl" />
                  <div className="relative bg-gradient-to-b from-stone-800/50 to-stone-900/80 border border-stone-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-red-500/70" />
                      <div className="w-2 h-2 rounded-full bg-amber-500/70" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
                      <span className="ml-2 text-[10px] text-stone-500 uppercase tracking-wider">New Quote</span>
                    </div>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-2 font-semibold">Job description</p>
                    <div className="bg-[#0a0a0f] border border-stone-700/50 rounded-lg p-4 min-h-[120px]">
                      <p className="text-sm text-stone-300 leading-relaxed">
                        Bathroom reno — demo old shower, waterproof, re-tile floor and walls, install new fixtures. 3 days on site.
                        <span className="inline-block w-0.5 h-4 bg-amber-400 ml-1 animate-pulse align-middle" />
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <div className="px-4 py-2 bg-amber-500 text-black text-xs font-semibold rounded-full inline-flex items-center gap-2">
                        Generate quote
                        <span>{`>`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2 — LEFT VISUAL, RIGHT TEXT */}
            <div className="how-step grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-3xl" />
                  <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">

                    <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">AI · 47 seconds</span>
                    </div>

                    <div className="bg-stone-900 px-5 py-4">
                      <p className="text-[8px] text-amber-400 font-bold uppercase tracking-widest">Quote</p>
                      <p className="text-lg font-bold text-white mt-0.5">Smith Plumbing</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">QUO-0004 — Bathroom Reno</p>
                      <p className="text-[9px] text-stone-500 mt-1">ABN 12 345 678 901 · 0412 345 678</p>
                    </div>

                    <div className="px-5 py-3 bg-stone-50 border-b border-stone-100">
                      <p className="text-[9px] text-stone-500 uppercase tracking-wider font-semibold">Quote for</p>
                      <p className="text-sm font-semibold text-stone-900">Sarah Henderson</p>
                      <p className="text-[10px] text-stone-500">14 Marlin St, Manly NSW 2095</p>
                    </div>

                    <div className="p-5 space-y-4">

                      <div>
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold mb-1.5">Greeting</p>
                        <p className="text-xs text-stone-700 leading-relaxed italic">
                          G&apos;day Sarah, thanks for getting in touch. As discussed, here&apos;s our quote for the bathroom renovation. Happy to talk through any of it.
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold mb-1.5">Scope of Work</p>
                        <p className="text-xs text-stone-700 leading-relaxed">
                          Full renovation of existing main bathroom over approximately 3 days on site. Demo and disposal of existing shower, tub, vanity, and tiling. Reframe and waterproof wet areas to AS3740. Re-tile floor and walls with supplied tiles. Supply and install new shower screen, vanity, mixer taps, toilet, and exhaust fan.
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-bold mb-1.5">Whats Included</p>
                        <ul className="space-y-1">
                          <li className="text-[11px] text-stone-700 flex gap-1.5"><span className="text-emerald-500">✓</span><span>Demolition and rubbish removal</span></li>
                          <li className="text-[11px] text-stone-700 flex gap-1.5"><span className="text-emerald-500">✓</span><span>Waterproofing certification</span></li>
                          <li className="text-[11px] text-stone-700 flex gap-1.5"><span className="text-emerald-500">✓</span><span>Wall and floor tiling labour</span></li>
                          <li className="text-[11px] text-stone-700 flex gap-1.5"><span className="text-emerald-500">✓</span><span>Fixture supply and installation</span></li>
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-stone-100">
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold mb-2">Line Items</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-stone-700"><span>Demolition and removal</span><span className="font-semibold">$320.00</span></div>
                          <div className="flex justify-between text-[11px] text-stone-700"><span>Waterproofing (incl. cert.)</span><span className="font-semibold">$480.00</span></div>
                          <div className="flex justify-between text-[11px] text-stone-700"><span>Tiling and grouting</span><span className="font-semibold">$540.00</span></div>
                          <div className="flex justify-between text-[11px] text-stone-700"><span>Fixture install (3 items)</span><span className="font-semibold">$333.00</span></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-stone-50 to-amber-50/40 rounded-lg p-3 space-y-1 border border-stone-100">
                        <div className="flex justify-between text-xs text-stone-600"><span>Subtotal</span><span>$1,673.00</span></div>
                        <div className="flex justify-between text-xs text-stone-600"><span>GST (10%)</span><span>$167.30</span></div>
                        <div className="flex justify-between text-base font-bold text-stone-900 pt-1.5 border-t border-stone-200"><span>Total</span><span className="text-amber-700">$1,840.30</span></div>
                      </div>

                      <div className="pt-2 border-t border-stone-100">
                        <p className="text-[9px] text-stone-500 uppercase tracking-wider font-semibold mb-1">Terms</p>
                        <p className="text-[10px] text-stone-600 leading-relaxed">Quote valid for 30 days. 50% deposit required before commencement. Balance due on completion. GST inclusive.</p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="order-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-sm mb-6">02</div>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
                  AI writes the quote<span className="text-amber-400">.</span>
                </h3>
                <p className="text-lg text-stone-400 leading-relaxed font-light max-w-md">
                  Scope of work. Line-item breakdown. GST. Terms. Even the &quot;G&apos;day&quot; greeting. Properly formatted, professional, ready to send.
                </p>
              </div>
            </div>

            {/* STEP 3 — LEFT TEXT, RIGHT VISUAL */}
            <div className="how-step grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-sm mb-6">03</div>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
                  Send and auto-chase<span className="text-amber-400">.</span>
                </h3>
                <p className="text-lg text-stone-400 leading-relaxed font-light max-w-md">
                  Customer gets the quote with Accept and Decline buttons. If they go quiet, SmokoHQ chases them at 48 hours and 5 days. You stay on the tools.
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-sky-500/10 blur-3xl rounded-3xl" />
                  <div className="relative space-y-3">

                    <div className="bg-gradient-to-b from-stone-800/50 to-stone-900/80 border border-stone-700/50 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-xs font-bold">SP</div>
                          <div>
                            <p className="text-xs font-semibold text-white">Smith Plumbing</p>
                            <p className="text-[10px] text-stone-500">to sarah@email.com</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-500">just now</span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">G&apos;day Sarah, here is the quote for your bathroom reno...</p>
                      <div className="mt-3 flex gap-2">
                        <div className="flex-1 bg-emerald-500 text-white text-[10px] font-bold text-center py-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">Accept Quote</div>
                        <div className="flex-1 bg-stone-800 border border-stone-700 text-stone-300 text-[10px] font-semibold text-center py-2 rounded-lg">Decline</div>
                      </div>
                    </div>

                    <div className="bg-stone-900/40 border border-stone-800/50 rounded-xl px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                        <p className="text-xs text-stone-300">Follow-up scheduled</p>
                      </div>
                      <p className="text-[10px] text-stone-500">in 48 hours</p>
                    </div>

                    <div className="bg-stone-900/40 border border-stone-800/50 rounded-xl px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                        <p className="text-xs text-stone-300">Second follow-up</p>
                      </div>
                      <p className="text-[10px] text-stone-500">in 5 days</p>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />
      </section>


      <section ref={creatorRef} className="relative px-6 py-32 overflow-hidden border-t border-stone-900/50">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.04),transparent_50%)]" />

        <div className="relative z-10 max-w-4xl mx-auto">

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span className="text-xs text-stone-300 font-medium tracking-wide uppercase">A note from the founder</span>
            </div>
          </div>

          <div className="space-y-12">

            <h2 ref={creatorHeadlineRef} className="text-[clamp(1.75rem,4vw,3.5rem)] leading-[1.1] font-bold tracking-[-0.03em] text-center max-w-3xl mx-auto">
              <span className="creator-line block text-stone-300">I watched my mates leave school for trades.</span>
              <span className="creator-line block text-stone-500 mt-3">Saw them quoting at 9pm after a 10-hour day.</span>
              <span className="creator-line block mt-3 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">SmokoHQ is for them.</span>
            </h2>

            <div className="creator-body max-w-2xl mx-auto space-y-6 text-stone-400 font-light leading-relaxed">
              <p className="text-base md:text-lg">
                I am Lucas. 17 years old, still in Year 11 at school in Sydney. I built SmokoHQ because every tradie I know is brilliant on the tools — and miserable on the paperwork. That always felt unfair.
              </p>

              <p className="text-base md:text-lg">
                The plan is simple: keep it cheap, keep it honest, and keep building what real tradies actually ask for. No corporate fluff, no sales pitches, no $200-a-month software trying to replace your bookkeeper.
              </p>

              <p className="text-base md:text-lg text-stone-300">
                Just better quotes, in less time, so you can stay where you do your best work — on the tools.
              </p>
            </div>

            <div className="creator-signature flex flex-col items-center pt-8">
              <div className="flex items-end gap-1">
                <span className="font-serif italic text-4xl md:text-5xl text-amber-400 transform -rotate-3" style={{ fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive' }}>
                  Lucas
                </span>
                <span className="text-amber-500/60 text-2xl mb-1">~</span>
              </div>
              <p className="mt-3 text-xs text-stone-500 uppercase tracking-[0.3em]">Founder · SmokoHQ</p>

              <div className="mt-8 inline-flex items-center gap-2 text-[10px] text-stone-600 uppercase tracking-widest">
                <span className="w-8 h-px bg-stone-700" />
                <span>Built in Sydney</span>
                <span className="w-8 h-px bg-stone-700" />
              </div>
            </div>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />
      </section>

      <section ref={ctaRef} className="relative px-6 py-32 overflow-hidden border-t border-stone-900/50">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(245,158,11,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,158,11,0.05),transparent_50%)]" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-xs text-stone-300 font-medium tracking-wide">Free during beta — no card required</span>
          </div>

          <h2 ref={ctaHeadlineRef} className="text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] font-bold tracking-[-0.04em] mb-10">
            <span className="cta-line block text-stone-300">Stop quoting at 9pm.</span>
            <span className="cta-line block mt-3 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">Start tomorrow.</span>
          </h2>

          <p className="cta-sub text-lg md:text-xl text-stone-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Sign up free. Send your first quote in 60 seconds. Never quote in the dark again.
          </p>

          <div className="cta-actions flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/login" className="group relative px-10 py-5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-lg rounded-full transition-all hover:shadow-[0_0_80px_rgba(245,158,11,0.6)] hover:-translate-y-0.5">
              <span className="relative z-10">Start Free</span>
              <span className="absolute inset-0 rounded-full bg-amber-500 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity -z-10" />
            </a>
            <a href="/pricing" className="px-8 py-5 text-stone-300 hover:text-white font-medium transition-colors flex items-center gap-2">
              See pricing
              <span className="text-stone-500">{`>`}</span>
            </a>
          </div>

          <p className="cta-trust mt-10 text-xs text-stone-600 uppercase tracking-widest">
            Built by a 17yo Aussie in Sydney · Real tradies in beta · No corporate fluff
          </p>

        </div>

      </section>

      <footer className="relative px-6 py-20 border-t border-stone-900/50 bg-[#08080c]">

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.04),transparent_70%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">

            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                <span className="text-white font-semibold text-lg tracking-tight">SmokoHQ</span>
              </div>
              <p className="text-base text-stone-400 leading-relaxed font-light max-w-sm">
                AI-powered quoting and invoicing for Aussie tradies. Built so you can stay on the tools and off the laptop at 9pm.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-[10px] text-stone-500 uppercase tracking-[0.3em]">
                <span>Built in Sydney</span>
                <span className="w-1 h-1 rounded-full bg-stone-700" />
                <span>By a 17yo founder</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold mb-4">Product</p>
              <ul className="space-y-2.5">
                <li><a href="/pricing" className="text-sm text-stone-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/login" className="text-sm text-stone-400 hover:text-white transition-colors">Sign in</a></li>
                <li><a href="/login" className="text-sm text-stone-400 hover:text-white transition-colors">Start free</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold mb-4">Resources</p>
              <ul className="space-y-2.5">
                <li><a href="/blog" className="text-sm text-stone-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="/blog/how-to-write-tradie-quote" className="text-sm text-stone-400 hover:text-white transition-colors">Quote guide</a></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <p className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold mb-4">Connect</p>
              <ul className="space-y-2.5">
                <li><a href="https://www.facebook.com/smokohq" className="text-sm text-stone-400 hover:text-white transition-colors inline-flex items-center gap-2">
                  Facebook
                  <span className="text-stone-600 text-xs">{`>`}</span>
                </a></li>
                <li><a href="mailto:quotes@smokohq.app" className="text-sm text-stone-400 hover:text-white transition-colors inline-flex items-center gap-2">
                  quotes@smokohq.app
                  <span className="text-stone-600 text-xs">{`>`}</span>
                </a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-stone-900 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-stone-500">
              © 2026 SmokoHQ. Made for Aussie tradies, one quote at a time.
            </p>
            <div className="flex items-center gap-6 text-xs text-stone-500">
              <a href="/privacy" className="hover:text-stone-300 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-stone-300 transition-colors">Terms</a>
            </div>
          </div>

        </div>
      </footer>

    </main>
  )
}
