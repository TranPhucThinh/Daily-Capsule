import { Archive, CalendarDays, SlidersHorizontal, SquareDot } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nProvider';
import { SealMark } from '../brand/SealMark';

const navItems = [
  { to: '/', label: 'nav.today', icon: SquareDot },
  { to: '/memories', label: 'nav.memories', icon: Archive },
  { to: '/calendar', label: 'nav.calendar', icon: CalendarDays },
] as const;

export function AppShell() {
  const { t } = useI18n();
  const location = useLocation();
  const showPrimaryNavigation = !location.pathname.startsWith('/capsule/');
  const currentLabel = location.pathname === '/'
    ? t('nav.today')
    : location.pathname.startsWith('/memories')
      ? t('nav.memories')
      : location.pathname.startsWith('/calendar')
        ? t('nav.calendar')
        : location.pathname.startsWith('/settings')
          ? t('nav.settings')
          : '';

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[480px] bg-album-paper shadow-[0_0_60px_rgb(0_0_0/20%)] md:max-w-[1060px]">
      <header className="sticky top-0 z-30 flex min-h-[calc(56px+env(safe-area-inset-top))] items-center justify-between border-b border-[rgb(79_66_53/8%)] bg-[rgb(251_248_241/96%)] px-5 pt-[env(safe-area-inset-top)] backdrop-blur-[14px] md:px-[38px]">
        <div className="flex min-w-0 items-center gap-2">
          <span className="size-2 shrink-0 rounded-full bg-persimmon-seal" />
          <NavLink className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[.69rem] font-semibold tracking-[.055em] uppercase no-underline" to="/" aria-label={t('nav.homeLabel')}>Daily Capsule</NavLink>
          {currentLabel ? <><span className="font-serif text-[#b4aca1]">/</span><span className="max-w-[70px] overflow-hidden text-ellipsis whitespace-nowrap font-display text-[.9rem] text-faded-ink">{currentLabel}</span></> : null}
        </div>
        <div className="flex items-center gap-1">
          <NavLink className="grid h-11 w-10 place-items-center no-underline" to="/settings" aria-label={t('nav.settingsLabel')}>
            <SlidersHorizontal aria-hidden="true" size={18} strokeWidth={1.5} />
          </NavLink>
          <NavLink className="grid h-11 w-9 place-items-center no-underline" to="/" aria-label={t('nav.todayLabel')}>
            <SealMark />
          </NavLink>
        </div>
      </header>

      <main className="px-5 pb-[calc(86px+env(safe-area-inset-bottom))] md:px-[38px]">
        <Outlet />
      </main>

      {showPrimaryNavigation ? (
        <nav className="fixed bottom-0 left-1/2 z-30 grid h-[calc(64px+env(safe-area-inset-bottom))] w-full max-w-[480px] -translate-x-1/2 grid-cols-3 border-t border-hairline-linen bg-[rgb(251_248_241/97%)] px-[26px] pt-[5px] pb-[env(safe-area-inset-bottom)] md:max-w-[1060px] md:px-[30%]" aria-label={t('nav.primaryLabel')}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              className={({ isActive }) => `relative grid min-h-[52px] place-items-center content-center gap-0.5 font-display text-xs tracking-[.035em] uppercase no-underline transition-[color,background-color,transform,box-shadow] duration-[180ms] ${isActive ? 'text-charcoal-ink after:absolute after:bottom-0 after:h-0.5 after:w-[18px] after:rounded-[10px] after:bg-persimmon-seal motion-safe:after:animate-[breathe_3s_ease-in-out_infinite]' : 'text-[#746d64]'}`}
              end={to === '/'}
              key={to}
              to={to}
            >
              <Icon aria-hidden="true" size={21} strokeWidth={1.75} />
              <span>{t(label)}</span>
            </NavLink>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
