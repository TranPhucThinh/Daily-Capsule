import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, isSameDay, startOfMonth, subMonths } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOOD_LABEL_KEYS } from '../components/ui/MoodGlyph';
import { capsuleService } from '../features/capsules/capsuleService';
import { useObjectUrl } from '../features/capsules/useObjectUrl';
import { useI18n } from '../i18n/I18nProvider';
import { useAuth } from '../features/auth/AuthProvider';

export function CalendarPage() {
  const { locale, t } = useI18n();
  const { user } = useAuth();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const capsules = useLiveQuery(() => capsuleService.getAll(user?.id), [user?.id]) ?? [];
  const monthDays = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const leadingBlanks = (getDay(startOfMonth(month)) + 6) % 7;
  const monthCapsules = capsules.filter((capsule) => capsule.date.startsWith(format(month, 'yyyy-MM')));
  const selected = monthCapsules[0];
  const moodCounts = monthCapsules.reduce<Record<string, number>>((counts, capsule) => ({ ...counts, [capsule.mood]: (counts[capsule.mood] ?? 0) + 1 }), {});
  const mostFrequentMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const weekdayLabels = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2024, 0, index + 1)));

  return (
    <section className="pt-7 md:mx-auto md:max-w-[440px]">
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-3.5">
        <h1 className="relative m-0 font-display text-[2.45rem] font-normal">{new Intl.DateTimeFormat(locale, { month: 'long' }).format(month)}<i className="mb-1 ml-[5px] inline-block size-[5px] rounded-full bg-persimmon-seal" /></h1>
        <span className="font-mono text-[.65rem] text-[#8d847b]">{format(month, 'yyyy')}</span>
        <div className="flex gap-[3px]"><button className="grid h-10 w-9 place-items-center border-0 bg-transparent text-[#716960]" aria-label={t('calendar.previous')} onClick={() => setMonth((value) => subMonths(value, 1))}><ChevronLeft size={17} /></button><button className="grid h-10 w-9 place-items-center border-0 bg-transparent text-[#716960]" aria-label={t('calendar.next')} onClick={() => setMonth((value) => addMonths(value, 1))}><ChevronRight size={17} /></button></div>
      </header>
      <div className="mt-[22px] grid grid-cols-7 text-center font-mono text-[.62rem] text-faded-ink">{weekdayLabels.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
      <div className="mt-[5px] grid grid-cols-7 gap-y-[3px]">
        {Array.from({ length: leadingBlanks }).map((_, index) => <span className="grid min-h-12 place-items-center content-center rounded-xl" key={`blank-${index}`} />)}
        {monthDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const capsule = monthCapsules.find((item) => item.date === dateKey);
          const isToday = isSameDay(day, new Date());
          const content = <><span>{format(day, 'd')}</span>{capsule ? <i /> : null}</>;
          const spokenDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(day);
          const dayClass = `grid min-h-12 place-items-center content-center rounded-xl font-display text-[.86rem] text-[#4b443d] no-underline transition-[color,background-color,transform,box-shadow] duration-[180ms] [&>i]:mt-1.5 [&>i]:size-1 [&>i]:rounded-full [&>i]:bg-persimmon-seal ${isToday ? 'outline outline-1 -outline-offset-[5px] outline-persimmon-seal' : ''}`;
          return capsule ? <Link aria-label={t('calendar.open', { date: spokenDate })} className={dayClass} key={dateKey} to={`/capsule/${dateKey}`}>{content}</Link> : <span className={dayClass} key={dateKey}>{content}</span>;
        })}
      </div>
      <div className="mt-5 border-t border-hairline-linen py-5"><strong className="font-mono text-[.62rem] tracking-[.06em] text-[#b15f44] uppercase">{t('calendar.summary')}</strong><p className="mt-2 mb-0 font-display text-[.87rem] leading-[1.55]">{t('calendar.daysSealed', { count: monthCapsules.length })} · {mostFrequentMood ? t('calendar.frequentMood', { mood: t(MOOD_LABEL_KEYS[mostFrequentMood as keyof typeof MOOD_LABEL_KEYS]) }) : t('calendar.unwritten')}</p></div>
      {selected ? <CalendarPreview capsule={selected} /> : <div className="flex justify-between rounded-[15px] bg-raised-paper p-[18px] font-display text-[.82rem] text-[#746d64]"><span>{t('calendar.empty')}</span><Link className="text-[#b15f44]" to="/">{t('calendar.keepToday')}</Link></div>}
      <p className="my-[34px] text-center font-mono text-[.6rem] tracking-[.05em] text-[#8d857c] uppercase">{t('calendar.folio', { number: format(month, 'MM') })}</p>
    </section>
  );
}

function CalendarPreview({ capsule }: { capsule: Awaited<ReturnType<typeof capsuleService.getAll>>[number] }) {
  const { locale, t } = useI18n();
  const imageUrl = useObjectUrl(capsule.imageBlob, capsule.imagePath);
  return (
    <Link className="relative grid min-h-28 grid-cols-[64px_1fr] gap-3.5 rounded-[18px] bg-raised-paper p-3.5 no-underline shadow-[0_7px_18px_rgb(75_60_44/6%)]" to={`/capsule/${capsule.date}`}>
      {imageUrl ? <img className="h-[84px] w-16 rounded-[9px] object-cover" alt={capsule.imageAlt || capsule.note} src={imageUrl} /> : null}
      <span className="grid content-center gap-1.5"><small className="font-mono text-[.58rem] text-[#b15f44]">{new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long' }).format(new Date(`${capsule.date}T12:00:00`)).toUpperCase()}</small><strong className="line-clamp-2 font-display text-[1.1rem] leading-[1.1] font-normal">“{capsule.note}”</strong><em className="font-mono text-[.58rem] not-italic uppercase">{t('calendar.view')}</em></span>
      <i className="absolute top-3.5 right-3.5 font-mono text-[.55rem] not-italic text-[#746d64] uppercase">{t(MOOD_LABEL_KEYS[capsule.mood])}</i>
    </Link>
  );
}
