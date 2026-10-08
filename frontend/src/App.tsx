import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  Globe2,
  Headphones,
  Mail,
  Menu,
  MessageCircle,
  MousePointer2,
  Route as GrowthPathIcon,
  Send,
  Sparkles,
  TicketCheck,
  UsersRound,
  X,
} from 'lucide-react';
import {
  Route as PageRoute,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

interface InquiryPayload {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  businessType: 'Yatra Operator' | 'Travel Agency' | 'Tour Operator' | 'Pilgrimage Business' | 'Other';
  message: string;
}

function useCreateNxYatraInquiry() {
  return useMutation({
    mutationFn: async (data: InquiryPayload) => {
      const response = await fetch('https://nxyatra.vercel.app/api/nx-yatra/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Failed to submit enquiry');
      }

      return (await response.json()) as { received: boolean; reference: string };
    },
  });
}

function Home() {
  const inquiry = useCreateNxYatraInquiry();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const closeMenu = () => setMobileMenuOpen(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReceipt(null);
    setSubmitError(null);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    inquiry.mutate(
      {
        name: String(form.get('name') ?? '').trim(),
        businessName: String(form.get('businessName') ?? '').trim(),
        phone: String(form.get('phone') ?? '').trim(),
        email: String(form.get('email') ?? '').trim(),
        businessType: String(form.get('businessType') ?? '') as
          | 'Yatra Operator'
          | 'Travel Agency'
          | 'Tour Operator'
          | 'Pilgrimage Business'
          | 'Other',
        message: String(form.get('message') ?? '').trim(),
      },
      {
        onSuccess: (result) => {
          if (result.received) {
            setReceipt(result.reference);
            formElement.reset();
          } else {
            setSubmitError('We could not confirm your enquiry. Please try again.');
          }
        },
        onError: (err: any) =>
          setSubmitError(err.message || 'Your enquiry could not be sent just now. Please try again.'),
      },
    );
  };

  return (
    <div id="nx-yatra-brighter" className="page-grain min-h-[100dvh] w-full overflow-x-hidden bg-[#f7f4eb] text-[#1d3934]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#ded8ca] bg-[#f7f4eb]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-3 sm:px-8 lg:px-12">
          <a href="#home" className="group flex items-center gap-3" aria-label="NX Yatra home" data-testid="link-home">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm border border-[#ded8ca] transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="NX Yatra Logo" className="h-full w-full object-contain" />
            </div>
            <span className="leading-tight">
              <span className="block font-display text-[18px] sm:text-[20px] font-extrabold tracking-[-.06em]">NX YATRA</span>
              <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[.18em] text-[#64746a]">Growth, in motion</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            <a className="nav-link text-[13px] font-medium transition-colors hover:text-[#df6f50]" href="#approach" data-testid="link-approach">Our approach</a>
            <a className="nav-link text-[13px] font-medium transition-colors hover:text-[#df6f50]" href="#capabilities" data-testid="link-capabilities">What we do</a>
            <a className="nav-link text-[13px] font-medium transition-colors hover:text-[#df6f50]" href="#journey" data-testid="link-journey">The journey</a>
          </nav>
          
          <a href="#contact" className="button-lift hidden items-center gap-2 rounded-full bg-[#1d3934] px-5 py-3 text-[12px] font-semibold text-[#fbf7ed] transition-transform hover:bg-[#254842] md:inline-flex" data-testid="link-header-contact">
            Start a conversation <ArrowUpRight size={15} />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ded8ca] bg-[#fbf9f1] text-[#1d3934] transition-colors hover:bg-[#ede7d7] md:hidden"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav aria-label="Mobile navigation" className="absolute left-0 right-0 top-full flex flex-col gap-2 border-b border-[#ded8ca] bg-[#f7f4eb]/98 px-5 pb-6 pt-3 shadow-xl backdrop-blur-lg md:hidden">
            <a onClick={closeMenu} className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-[#1d3934] hover:bg-[#ebe5d5]" href="#approach" data-testid="mobile-link-approach">
              Our approach <ArrowRight size={16} className="opacity-60" />
            </a>
            <a onClick={closeMenu} className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-[#1d3934] hover:bg-[#ebe5d5]" href="#capabilities" data-testid="mobile-link-capabilities">
              What we do <ArrowRight size={16} className="opacity-60" />
            </a>
            <a onClick={closeMenu} className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-[#1d3934] hover:bg-[#ebe5d5]" href="#journey" data-testid="mobile-link-journey">
              The journey <ArrowRight size={16} className="opacity-60" />
            </a>
            <a onClick={closeMenu} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#1d3934] px-4 py-4 text-center text-sm font-semibold text-[#fbf7ed] shadow-md active:scale-95" href="#contact" data-testid="mobile-link-contact">
              Start a conversation <ArrowUpRight size={16} />
            </a>
          </nav>
        )}
      </header>

      <main id="home">
        {/* HERO SECTION */}
        <section className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-4 pb-14 pt-8 sm:px-8 md:pb-24 md:pt-16 lg:grid-cols-[.94fr_1.06fr] lg:gap-10 lg:px-12 lg:pt-20">
          <div className="relative z-10 max-w-[610px]">
            <div className="reveal mb-5 sm:mb-7 inline-flex items-center gap-2 rounded-full border border-[#d9d3c4] bg-[#f1ede2] px-3.5 py-1.5 sm:py-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[.13em] text-[#45605a]">
              <span className="h-2 w-2 rounded-full bg-[#df6f50] animate-pulse" /> Digital growth for India's travel businesses
            </div>
            
            <h1 className="reveal reveal-delay-1 font-display text-[clamp(2.4rem,7.5vw,5.5rem)] font-semibold leading-[.98] tracking-[-.06em]">
              More journeys<br />
              <span className="whitespace-nowrap">
                begin with{' '}
                <span className="relative inline-block text-[#df6f50]">
                  you
                  <span className="absolute -bottom-1 left-0 h-[4px] sm:h-[5px] w-[94%] rounded-full bg-[#d4a75b]/70" />
                </span>
                .
              </span>
            </h1>
            
            <p className="reveal reveal-delay-2 mt-5 sm:mt-7 max-w-[490px] text-[15px] sm:text-[18px] leading-[1.7] text-[#526861]">
              NX Yatra helps travel agencies, tour operators and yatra providers turn their expertise into a stronger digital presence—and more meaningful passenger conversations.
            </p>
            
            <div className="reveal reveal-delay-2 mt-7 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <a href="#contact" className="button-lift flex items-center justify-center gap-3 rounded-full bg-[#df6f50] px-6 py-3.5 sm:py-4 text-sm font-semibold text-[#fff8ef] shadow-md transition-all hover:bg-[#c95d40] active:scale-95" data-testid="link-hero-contact">
                Talk about your growth <ArrowRight size={17} />
              </a>
              <a href="#journey" className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-[#1d3934] hover:text-[#df6f50] transition-colors" data-testid="link-hero-journey">
                Explore the journey <ArrowDownRight size={16} />
              </a>
            </div>

            <div className="mt-10 sm:mt-12 flex items-center gap-4 border-t border-[#d9d3c4] pt-5">
              <div className="flex -space-x-2 shrink-0" aria-hidden="true">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f7f4eb] bg-[#d4a75b] text-[10px] font-bold text-[#243f38]">01</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f7f4eb] bg-[#a9b8a3] text-[10px] font-bold text-[#243f38]">02</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f7f4eb] bg-[#e5a18a] text-[10px] font-bold text-[#243f38]">03</span>
              </div>
              <p className="max-w-[330px] text-[11px] sm:text-[12px] leading-4 sm:leading-5 text-[#62736c]">One connected growth partner—from the first impression to the next booking.</p>
            </div>
          </div>

          {/* Hero Banner Image & Floating Badges */}
          <div className="relative mx-auto w-full max-w-[670px] reveal reveal-delay-1 mt-4 lg:mt-0">
            <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[#d8dfd4] shadow-lg border border-[#c8d2c4]">
              <img className="block aspect-[1.15/1] w-full object-cover" src="/yatra-landscape.png" alt="Illustrated pilgrimage route winding through layered Himalayan foothills" data-testid="img-hero-landscape" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#19352e]/65 via-transparent to-transparent" />
              
              <div className="absolute left-4 top-4 sm:left-7 sm:top-7 flex items-center gap-2 rounded-full bg-[#f7f4eb]/95 px-3 py-1.5 sm:px-3.5 sm:py-2 font-mono text-[9px] uppercase tracking-[.14em] text-[#344d45] backdrop-blur-sm shadow-sm">
                <Compass size={13} /> A clearer way forward
              </div>

              <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 flex items-end justify-between text-[#fff9ee]">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[.18em] text-[#e6c99a]">Your next chapter</span>
                  <p className="mt-1.5 sm:mt-2 max-w-[270px] font-display text-xl sm:text-3xl font-semibold leading-tight tracking-[-.035em]">Built around the way your business travels.</p>
                </div>
                <span className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/50 sm:flex"><ArrowUpRight size={19} /></span>
              </div>
            </div>

            {/* Mobile-friendly Floating Card Badge */}
            <div className="mt-4 sm:absolute sm:-bottom-6 sm:-left-6 flex items-center gap-3 rounded-2xl border border-[#ded8ca] bg-[#fbf9f1] px-4 py-3 shadow-[0_10px_30px_rgba(38,58,48,.10)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9e1d0] text-[#1d3934]">
                <img src="/logo.png" alt="Logo" className="h-6 w-auto object-contain" />
              </div>
              <div>
                <p className="text-[12px] font-semibold">From discovery to enquiry</p>
                <p className="mt-0.5 text-[10px] text-[#697970]">A connected passenger experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* PROMISES BAR */}
        <section className="border-y border-[#d9d3c4] bg-[#f0ecdf]">
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-6 px-4 py-6 sm:px-8 md:py-8 lg:px-12">
            {[
              ['01', 'Be discoverable', 'A digital home for your business'],
              ['02', 'Show the journey', 'Packages with clarity and character'],
              ['03', 'Start conversations', 'Enquiries with a clear next step'],
              ['04', 'Stay connected', 'Relationships beyond one trip'],
            ].map(([num, title, detail]) => (
              <div className="flex items-start gap-3 rounded-lg p-2 transition-colors sm:p-0" key={num} data-testid={`text-promise-${num}`}>
                <span className="pt-0.5 font-mono text-[11px] font-semibold text-[#df6f50]">{num}</span>
                <div>
                  <p className="text-[13px] font-semibold text-[#1d3934]">{title}</p>
                  <p className="mt-0.5 text-[11px] leading-4 text-[#66766d]">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OUR APPROACH */}
        <section id="approach" className="mx-auto grid max-w-[1320px] gap-10 sm:gap-14 px-4 py-16 sm:px-8 md:py-28 lg:grid-cols-[.78fr_1.22fr] lg:gap-20 lg:px-12">
          <div>
            <p className="mb-4 sm:mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-[#df6f50]"><span className="h-px w-7 bg-[#df6f50]" /> The opportunity</p>
            <h2 className="font-display text-[clamp(2.1rem,4.5vw,4.6rem)] font-semibold leading-[1.02] tracking-[-.06em]">Your work is personal.<br /><span className="text-[#73847a]">Your growth can be, too.</span></h2>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 md:gap-10">
            <p className="text-[15px] sm:text-[17px] leading-[1.75] text-[#405951]">Every itinerary carries local knowledge, care and countless details. But when your business is hard to find—or a good enquiry gets lost in the shuffle—that expertise can be difficult for new passengers to see.</p>
            <div className="border-l-2 border-[#d9d3c4] pl-5 sm:pl-6">
              <p className="text-[13px] sm:text-[14px] leading-6 sm:leading-7 text-[#63756c]">NX Yatra brings the pieces together: a clear brand, useful digital touchpoints, relevant package promotion, and a practical path from first interest to follow-up.</p>
              <a href="#capabilities" className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold text-[#1d3934] hover:text-[#df6f50] transition-colors" data-testid="link-approach-capabilities">See how we help <ArrowRight size={14} /></a>
            </div>
          </div>
        </section>

        {/* GROWTH JOURNEY SECTION */}
        <section id="journey" className="relative overflow-hidden bg-[#1d3934] py-16 text-[#f7f4eb] sm:py-24 md:py-28">
          <div className="pointer-events-none absolute -right-32 -top-40 h-[440px] w-[440px] rounded-full border border-white/[.08]" />
          <div className="pointer-events-none absolute -right-20 -top-28 h-[320px] w-[320px] rounded-full border border-white/[.08]" />
          
          <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12">
            <div className="grid items-end gap-5 md:grid-cols-[1fr_.58fr]">
              <div>
                <p className="mb-4 sm:mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-[#e4a38c]"><span className="h-px w-7 bg-[#e4a38c]" /> The NX Yatra growth journey</p>
                <h2 className="max-w-[740px] font-display text-[clamp(2.2rem,5vw,5.2rem)] font-semibold leading-[.96] tracking-[-.06em]">A better journey for<br className="hidden md:block" /> your business, too.</h2>
              </div>
              <p className="max-w-[360px] pb-1 text-[13px] sm:text-[14px] leading-6 sm:leading-7 text-[#c2cec4]">Six connected steps. A thoughtful foundation, a more visible offer, and a passenger relationship that can continue after the trip.</p>
            </div>

            <div className="relative mt-10 sm:mt-14">
              <svg className="absolute left-0 top-[33px] hidden h-16 w-full overflow-visible lg:block" viewBox="0 0 1180 64" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 32 C 95 32, 100 20, 195 20 S 290 45, 392 45 S 490 17, 590 17 S 695 43, 786 43 S 888 18, 982 18 S 1080 32, 1177 32" fill="none" stroke="#789088" strokeWidth="1.5" className="route-dash" />
              </svg>

              <div className="relative grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
                {[
                  { n: '01', title: 'BRAND', icon: Sparkles, line: 'Make your business easy to recognise and remember.', detail: 'Positioning, identity and a clear story.' },
                  { n: '02', title: 'MARKET', icon: Globe2, line: 'Give your packages a useful place to be discovered.', detail: 'Digital presence built for real decisions.' },
                  { n: '03', title: 'REACH', icon: MousePointer2, line: 'Put the right journeys in front of relevant people.', detail: 'Campaigns shaped around your audience.' },
                  { n: '04', title: 'CONNECT', icon: MessageCircle, line: 'Make it simple to ask, understand and respond.', detail: 'Enquiry paths and practical follow-up.' },
                  { n: '05', title: 'BOOK', icon: TicketCheck, line: 'Support a confident move from interest to booking.', detail: 'Clear package details and booking support.' },
                  { n: '06', title: 'GROW', icon: ArrowUpRight, line: 'Keep the relationship going beyond one journey.', detail: 'Thoughtful communication for what comes next.' },
                ].map(({ n, title, icon: Icon, line, detail }) => (
                  <article key={n} className="group rounded-2xl border border-white/[.14] bg-[#25463e]/85 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/30" data-testid={`card-journey-${title.toLowerCase()}`}>
                    <div className="mb-6 flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[.12em] text-[#e8b28d]">{n}</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[#e8b28d]"><Icon size={16} strokeWidth={1.7} /></span>
                    </div>
                    <h3 className="font-display text-[20px] font-bold tracking-[.025em]">{title}</h3>
                    <p className="mt-2 text-[12px] leading-5 text-[#e0e8dd] sm:min-h-[55px]">{line}</p>
                    <p className="mt-4 border-t border-white/[.14] pt-3 text-[10px] leading-4 text-[#aabbb0]">{detail}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-[11px] text-[#bdccc0]">
              <span className="h-2 w-2 rounded-full bg-[#e07b5b]" /> Not a one-size-fits-all funnel. The journey is shaped around your business.
            </div>
          </div>
        </section>

        {/* CAPABILITIES SECTION */}
        <section id="capabilities" className="mx-auto max-w-[1320px] px-4 py-16 sm:px-8 md:py-28 lg:px-12">
          <div className="mb-10 sm:mb-12 grid gap-5 md:grid-cols-[1fr_.6fr] md:items-end">
            <div>
              <p className="mb-4 sm:mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-[#df6f50]"><span className="h-px w-7 bg-[#df6f50]" /> What we bring together</p>
              <h2 className="max-w-[700px] font-display text-[clamp(2.2rem,4.5vw,4.7rem)] font-semibold leading-[.98] tracking-[-.06em]">The right pieces, in the right order.</h2>
            </div>
            <p className="max-w-[390px] text-[13px] sm:text-[14px] leading-6 sm:leading-7 text-[#66766d]">We connect strategy and day-to-day execution, so your digital presence feels like one considered experience—not a collection of disconnected tasks.</p>
          </div>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
            <article className="relative overflow-hidden rounded-[24px] sm:rounded-[26px] bg-[#e9e5d8] p-6 sm:p-9 lg:col-span-5" data-testid="card-capability-presence">
              <div className="mb-8 sm:mb-12 flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[.15em] text-[#62746b]">01 / Be remembered</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d5ddd0] text-[#1d3934]"><BadgeCheck size={19} /></span>
              </div>
              <h3 className="max-w-[300px] font-display text-2xl sm:text-3xl font-semibold leading-[1.08] tracking-[-.05em]">A presence that feels like your business.</h3>
              <p className="mt-3.5 max-w-[390px] text-[13px] leading-6 text-[#5d6f66]">Create a clear foundation that introduces your business, explains what you offer and makes it easy for a passenger to take the next step.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#c9cdbf] px-3 py-1 text-[10px]">Brand story</span>
                <span className="rounded-full border border-[#c9cdbf] px-3 py-1 text-[10px]">Website presence</span>
                <span className="rounded-full border border-[#c9cdbf] px-3 py-1 text-[10px]">Package presentation</span>
              </div>
            </article>

            <article className="rounded-[24px] sm:rounded-[26px] border border-[#ded8ca] bg-[#fbf9f1] p-6 sm:p-9 lg:col-span-4" data-testid="card-capability-reach">
              <div className="mb-8 sm:mb-12 flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[.15em] text-[#df6f50]">02 / Find your people</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1e1d6] text-[#b85e45]"><Globe2 size={18} /></span>
              </div>
              <h3 className="max-w-[290px] font-display text-2xl sm:text-3xl font-semibold leading-[1.08] tracking-[-.05em]">Relevant reach, not noise.</h3>
              <p className="mt-3.5 text-[13px] leading-6 text-[#63746b]">Give the right audiences a reason to discover your business through considered content and package promotion.</p>
              <ul className="mt-5 space-y-2.5 text-[12px] text-[#405951]">
                <li className="flex items-center gap-2"><Check size={14} className="text-[#df6f50]" /> Audience-aware promotion</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#df6f50]" /> Clear, useful package stories</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-[#df6f50]" /> Consistent digital communication</li>
              </ul>
            </article>

            <article className="rounded-[24px] sm:rounded-[26px] bg-[#dfe7dc] p-6 sm:p-9 lg:col-span-3" data-testid="card-capability-connection">
              <div className="mb-8 sm:mb-12 flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[.15em] text-[#62746b]">03 / Keep moving</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c9d9c9] text-[#42665a]"><Headphones size={18} /></span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-[1.08] tracking-[-.05em]">Every enquiry gets a next step.</h3>
              <p className="mt-3.5 text-[13px] leading-6 text-[#5d6f66]">Shape a clearer route from a passenger's first question through booking support and future follow-up.</p>
              <div className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.1em] text-[#476157]">
                <span>Ask</span><ArrowRight size={12} /><span>Plan</span><ArrowRight size={12} /><span>Return</span>
              </div>
            </article>
          </div>
        </section>

        {/* AUDIENCE SECTION */}
        <section className="border-y border-[#ded8ca] bg-[#f0ecdf]">
          <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-[.78fr_1.22fr] lg:gap-20 lg:px-12">
            <div>
              <p className="mb-4 sm:mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-[#df6f50]"><span className="h-px w-7 bg-[#df6f50]" /> Made for the people who make the trip</p>
              <h2 className="font-display text-[clamp(2.1rem,4.5vw,4.5rem)] font-semibold leading-[.98] tracking-[-.06em]">Your kind of travel.<br />Your kind of growth.</h2>
              <p className="mt-4 max-w-[390px] text-[13px] sm:text-[14px] leading-6 sm:leading-7 text-[#63746b]">We work with businesses built around meaningful journeys, group travel and the people who bring each detail together.</p>
            </div>
            <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
              {[
                { icon: Compass, title: 'Yatra operators', desc: 'Present pilgrimage journeys with clarity, care and the practical details passengers need.' },
                { icon: Globe2, title: 'Travel agencies', desc: 'Build a digital presence that reflects the knowledge and service behind your agency.' },
                { icon: CalendarDays, title: 'Tour operators', desc: 'Give each tour a clear story, useful package details and a straightforward enquiry path.' },
                { icon: UsersRound, title: 'Pilgrimage businesses', desc: 'Connect with passengers and families planning an important journey together.' },
              ].map(({ icon: Icon, title, desc }, index) => (
                <article key={title} className="flex gap-3.5 rounded-2xl border border-[#d8d2c4] bg-[#f7f4eb] p-4 sm:p-6" data-testid={`card-audience-${index}`}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8e2d4] text-[#45655b]"><Icon size={17} /></span>
                  <div>
                    <h3 className="text-[13px] font-semibold text-[#1d3934]">{title}</h3>
                    <p className="mt-1.5 text-[11px] leading-5 text-[#65766d]">{desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WORKING STEPS SECTION */}
        <section className="mx-auto max-w-[1320px] px-4 py-16 sm:px-8 md:py-28 lg:px-12">
          <div className="grid gap-10 md:grid-cols-[.74fr_1.26fr] md:gap-20">
            <div>
              <p className="mb-4 sm:mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-[#df6f50]"><span className="h-px w-7 bg-[#df6f50]" /> How we work</p>
              <h2 className="font-display text-[clamp(2.2rem,4.5vw,4.5rem)] font-semibold leading-[.98] tracking-[-.06em]">Start with your next step.</h2>
              <p className="mt-4 max-w-[370px] text-[13px] sm:text-[14px] leading-6 sm:leading-7 text-[#66766d]">No pre-set package to squeeze into. We start by understanding your business, your passengers and what you want to make easier.</p>
            </div>
            <div className="divide-y divide-[#ded8ca]">
              {[
                { n: '01', title: 'Tell us where you are', copy: 'Share what you do, who you serve and the part of growth you want to work on.' },
                { n: '02', title: 'Find the right route', copy: 'Together, identify the most useful first move across brand, visibility, enquiries or follow-up.' },
                { n: '03', title: 'Build and keep improving', copy: 'Move into practical work with a clear focus—and room to grow into the next step.' },
              ].map(({ n, title, copy }) => (
                <div className="grid gap-2 py-5 sm:py-6 sm:grid-cols-[50px_1fr_1.2fr] sm:items-start sm:gap-5" key={n} data-testid={`text-working-step-${n}`}>
                  <span className="font-mono text-[11px] font-semibold text-[#df6f50]">{n}</span>
                  <h3 className="font-display text-[19px] sm:text-[20px] font-semibold tracking-[-.03em]">{title}</h3>
                  <p className="max-w-[330px] text-[12px] leading-5 text-[#65766d]">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT / ENQUIRY FORM SECTION */}
        <section id="contact" className="relative overflow-hidden bg-[#1d3934] py-16 text-[#f7f4eb] sm:py-24 md:py-28">
          <div className="pointer-events-none absolute -bottom-48 -left-20 h-[460px] w-[460px] rounded-full border border-white/[.08]" />
          <div className="pointer-events-none absolute -bottom-32 left-0 h-[300px] w-[300px] rounded-full border border-white/[.08]" />
          
          <div className="relative mx-auto grid max-w-[1320px] gap-10 px-4 sm:px-8 lg:grid-cols-[.86fr_1.14fr] lg:gap-20 lg:px-12">
            <div className="max-w-[500px]">
              <p className="mb-4 sm:mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.18em] text-[#e4a38c]"><span className="h-px w-7 bg-[#e4a38c]" /> Your next step</p>
              <h2 className="font-display text-[clamp(2.5rem,5.5vw,5.5rem)] font-semibold leading-[.94] tracking-[-.06em]">Let's put your<br />business in motion.</h2>
              <p className="mt-5 max-w-[400px] text-[13px] sm:text-[14px] leading-6 sm:leading-7 text-[#c3d0c7]">Tell us a little about your travel business and what you would like to grow. We’ll use that as the starting point for a useful conversation.</p>
              
              <div className="mt-8 space-y-4 border-t border-white/[.18] pt-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#e8b28d] shrink-0">
                    <Mail size={16} />
                  </span>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-[.15em] text-[#e4a38c]">Direct Email</span>
                    <a href="mailto:nexisparkxofficial@nexisparkx.com" className="text-[13px] font-semibold text-[#f7f4eb] hover:text-[#e4a38c] transition-colors">
                      nexisparkxofficial@nexisparkx.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[#e8b28d] shrink-0"><MessageCircle size={14} /></span>
                  <p className="text-[12px] leading-5 text-[#d1dcd2]">Share the challenge or opportunity on your mind.</p>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[#e8b28d] shrink-0"><GrowthPathIcon size={14} /></span>
                  <p className="text-[12px] leading-5 text-[#d1dcd2]">We’ll understand the context before suggesting a route.</p>
                </div>
              </div>
            </div>

            {/* FORM CARD */}
            <form onSubmit={handleSubmit} className="rounded-[20px] sm:rounded-[24px] bg-[#f7f4eb] p-5 sm:p-8 lg:p-9 text-[#1d3934] shadow-2xl" data-testid="form-inquiry">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[.16em] text-[#df6f50]">Start a conversation</span>
                  <h3 className="mt-1.5 font-display text-[22px] sm:text-[27px] font-semibold tracking-[-.05em]">What are you planning?</h3>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e9e4d7] text-[#1d3934]">
                  <img src="/logo.png" alt="Logo" className="h-6 w-auto object-contain" />
                </div>
              </div>

              <div className="grid gap-x-4 gap-y-4 grid-cols-1 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold">Your name <span className="text-[#df6f50]">*</span></span>
                  <input name="name" autoComplete="name" required minLength={2} maxLength={100} className="w-full rounded-lg border border-[#d9d3c4] bg-[#fbf9f1] px-3.5 py-3 text-[13px] placeholder:text-[#919b91] focus:border-[#df6f50] focus:outline-none" placeholder="Name" data-testid="input-name" />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold">Business name <span className="text-[#df6f50]">*</span></span>
                  <input name="businessName" autoComplete="organization" required minLength={2} maxLength={120} className="w-full rounded-lg border border-[#d9d3c4] bg-[#fbf9f1] px-3.5 py-3 text-[13px] placeholder:text-[#919b91] focus:border-[#df6f50] focus:outline-none" placeholder="Your business" data-testid="input-business-name" />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold">Phone <span className="text-[#df6f50]">*</span></span>
                  <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={24} className="w-full rounded-lg border border-[#d9d3c4] bg-[#fbf9f1] px-3.5 py-3 text-[13px] placeholder:text-[#919b91] focus:border-[#df6f50] focus:outline-none" placeholder="+91" data-testid="input-phone" />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold">Email <span className="text-[#df6f50]">*</span></span>
                  <input name="email" type="email" autoComplete="email" required maxLength={254} className="w-full rounded-lg border border-[#d9d3c4] bg-[#fbf9f1] px-3.5 py-3 text-[13px] placeholder:text-[#919b91] focus:border-[#df6f50] focus:outline-none" placeholder="you@business.com" data-testid="input-email" />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-[11px] font-semibold">Business type <span className="text-[#df6f50]">*</span></span>
                  <span className="relative block">
                    <select name="businessType" required defaultValue="" className="w-full appearance-none rounded-lg border border-[#d9d3c4] bg-[#fbf9f1] px-3.5 py-3 text-[13px] text-[#405951] focus:border-[#df6f50] focus:outline-none" data-testid="select-business-type">
                      <option value="" disabled>Select your business type</option>
                      <option>Yatra Operator</option>
                      <option>Travel Agency</option>
                      <option>Tour Operator</option>
                      <option>Pilgrimage Business</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-3.5 text-[#66766d]" />
                  </span>
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-[11px] font-semibold">What would you like to work on? <span className="text-[#df6f50]">*</span></span>
                  <textarea name="message" required minLength={10} maxLength={2000} rows={4} className="w-full resize-y rounded-lg border border-[#d9d3c4] bg-[#fbf9f1] px-3.5 py-3 text-[13px] leading-5 placeholder:text-[#919b91] focus:border-[#df6f50] focus:outline-none" placeholder="A few words about your business and what you’d like to grow…" data-testid="input-message" />
                </label>
              </div>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-[245px] text-[10px] leading-4 text-[#77857b]">Your details are shared with NX Yatra to respond to this enquiry.</p>
                <button type="submit" disabled={inquiry.isPending} className="button-lift flex w-full sm:w-auto min-h-12 items-center justify-center gap-2 rounded-full bg-[#df6f50] px-7 py-3 text.sm font-semibold text-[#fff8ef] transition-transform active:scale-95 disabled:cursor-wait disabled:opacity-70" data-testid="button-submit-inquiry">
                  {inquiry.isPending ? 'Sending your enquiry…' : 'Send an enquiry'} <Send size={15} />
                </button>
              </div>

              {receipt && (
                <div role="status" className="mt-5 flex items-start gap-3 rounded-xl border border-[#b8cdbb] bg-[#e8f0e6] p-4 text-[12px] text-[#2d5846]" data-testid="status-inquiry-success">
                  <Check size={17} className="mt-0.5 shrink-0 text-[#2d5846]" />
                  <p><strong>Enquiry received.</strong> Thank you for reaching out. Reference: <span className="font-mono font-bold">{receipt}</span></p>
                </div>
              )}
              {submitError && (
                <div role="alert" className="mt-5 rounded-xl border border-[#e5b9a9] bg-[#faece6] p-4 text-[12px] text-[#8f3f2e]" data-testid="status-inquiry-error">
                  {submitError}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#162e29] text-[#dce4da]">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-4 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <a href="#home" className="flex items-center gap-3" data-testid="link-footer-home">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
              <img src="/logo.png" alt="NX Yatra Logo" className="h-full w-full object-contain" />
            </div>
            <span>
              <span className="block font-display text-[16px] font-bold tracking-[-.04em]">NX YATRA</span>
              <span className="font-mono text-[8px] uppercase tracking-[.15em] text-[#a9bbb0]">Growth, in motion</span>
            </span>
          </a>
          
          <div className="flex flex-col gap-1">
            <p className="text-[11px] text-[#a9bbb0]">
              Digital growth partner for travel, tours and yatra businesses.
              <span className="mt-0.5 block text-[10px]">A NexisparkX Group Product</span>
            </p>
            <a href="mailto:nexisparkxofficial@nexisparkx.com" className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#e4a38c] hover:underline">
              <Mail size={13} /> nexisparkxofficial@nexisparkx.com
            </a>
          </div>

          <a href="#home" className="inline-flex items-center gap-2 text-[11px] font-medium text-[#dce4da] hover:text-white transition-colors" data-testid="link-back-top">
            Back to top <ArrowUpRight size={14} />
          </a>
        </div>
        
        <div className="border-t border-white/[.12] px-4 py-4 text-center font-mono text-[9px] tracking-[.06em] text-[#82978c]">
          © {new Date().getFullYear()} NX Yatra · Built for journeys that matter.
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <PageRoute path="/" component={Home} />
        <PageRoute component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
