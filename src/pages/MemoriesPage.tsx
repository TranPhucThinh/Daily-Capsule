import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'motion/react';
import { ArrowUpRight, BookOpen, Heart, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOOD_LABEL_KEYS } from '../components/ui/MoodGlyph';
import { capsuleService } from '../features/capsules/capsuleService';
import { useObjectUrl } from '../features/capsules/useObjectUrl';
import { useI18n } from '../i18n/I18nProvider';
import { useAuth } from '../features/auth/AuthProvider';

export function MemoriesPage() {
  const { locale, t } = useI18n();
  const { user } = useAuth();
  const capsules = useLiveQuery(() => capsuleService.getAll(user?.id), [user?.id]) ?? [];

  return (
    <section className="md:mx-auto md:max-w-[440px]">
      <header className="py-5 pb-[34px]">
        <span className="font-mono text-[.65rem] tracking-[.08em] text-faded-ink">{new Date().getFullYear()}</span>
        <h1 className="mt-[5px] mb-1 font-display text-[2.7rem] leading-none font-normal">{t('memories.title')}</h1>
        <p className="m-0 font-display text-[.83rem] text-faded-ink">{t('memories.description')}</p>
      </header>

      {capsules.length ? (
        <div className="border-t border-hairline-linen pt-[18px]">
          <div className="flex items-center justify-between font-mono text-[.64rem] tracking-[.03em] text-[#5a5149] uppercase"><strong>{new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date()).toUpperCase()} <em className="font-normal not-italic text-[#8f877d]">/ {t('memories.currentChapter')}</em></strong><span className="rounded-[10px] bg-[#ede8df] px-2 py-1 font-display text-[.69rem] tracking-normal text-[#bb6649] normal-case">{t('memories.count', { count: capsules.length })}</span></div>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6">
            {capsules.map((capsule, index) => <MemoryCard capsule={capsule} featured={index === 0} index={index} key={capsule.id} />)}
          </div>
        </div>
      ) : <SampleArchive />}
    </section>
  );
}

function MemoryCard({ capsule, featured, index }: { capsule: Awaited<ReturnType<typeof capsuleService.getAll>>[number]; featured: boolean; index: number }) {
  const { locale, t } = useI18n();
  const imageUrl = useObjectUrl(capsule.imageBlob, capsule.imagePath);
  const date = new Date(`${capsule.date}T12:00:00`);

  return (
    <motion.article animate={{ opacity: 1, y: 0 }} className={`min-w-0 ${featured ? 'col-span-full' : ''}`} initial={{ opacity: 0, y: 12 }} transition={{ delay: index * 0.04 }}>
      <Link className="block no-underline" to={`/capsule/${capsule.date}`}>
        <div className="relative overflow-hidden rounded-[20px] bg-[#e5ded3] shadow-[0_12px_26px_rgb(67_51_39/11%)]">
          {imageUrl ? <img className="block aspect-[4/5] w-full object-cover" alt={capsule.imageAlt || capsule.note} src={imageUrl} /> : null}
          {featured ? <span className="absolute top-3.5 right-3.5 rounded-full bg-[rgb(251_248_241/94%)] px-[11px] py-[7px] font-mono text-[.58rem] tracking-[.05em] uppercase">{t('memories.placard')}</span> : null}
          {featured ? <span className="absolute right-3.5 bottom-3 left-3.5 flex items-center justify-between font-mono text-[.6rem] tracking-[.05em] text-[#f9f4ec] uppercase">{t('memories.eveningCapsule')} <ArrowUpRight size={15} /></span> : null}
        </div>
        <div className="mt-3 flex gap-[7px] font-mono text-[.62rem] text-[#675f56] uppercase"><span>{new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' }).format(date).toUpperCase()}</span><i>·</i><span>{t(MOOD_LABEL_KEYS[capsule.mood])}</span></div>
        <p className={`mt-2 mb-0 font-display leading-[1.08] ${featured ? 'text-[1.4rem]' : 'text-base'}`}>“{capsule.note}”</p>
      </Link>
    </motion.article>
  );
}

function SampleArchive() {
  const { locale, t } = useI18n();
  const sampleDate = (day: number) => new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' }).format(new Date(2025, 9, day)).toUpperCase();

  return (
    <div className="border-t border-hairline-linen pt-[18px]">
      <div className="flex items-center justify-between font-mono text-[.64rem] tracking-[.03em] text-[#5a5149] uppercase"><strong>{t('memories.firstChapter')} <em className="font-normal not-italic text-[#8f877d]">/ {t('memories.preview')}</em></strong><span className="rounded-[10px] bg-[#ede8df] px-2 py-1 font-display text-[.69rem] tracking-normal text-[#bb6649] normal-case">{t('memories.beginToday')}</span></div>
      <article className="mt-6">
        <div className="relative overflow-hidden rounded-[20px] bg-[#e5ded3] shadow-[0_12px_26px_rgb(67_51_39/11%)]"><img className="block aspect-[4/5] w-full object-cover" alt={t('memories.sample1Alt')} src="/images/rainy-paris-balcony.jpg" /><span className="absolute top-3.5 right-3.5 rounded-full bg-[rgb(251_248_241/94%)] px-[11px] py-[7px] font-mono text-[.58rem] tracking-[.05em] uppercase">{t('memories.placard')}</span><span className="absolute right-3.5 bottom-3 left-3.5 flex items-center justify-between font-mono text-[.6rem] tracking-[.05em] text-[#f9f4ec] uppercase">{t('memories.eveningCapsule')} <ArrowUpRight size={15} /></span></div>
        <div className="mt-3 flex gap-[7px] font-mono text-[.62rem] text-[#675f56] uppercase"><span>{sampleDate(22)}</span><i>·</i><span>{t('mood.still')}</span><i>·</i><span>19:42</span></div>
        <p className="mt-2 mb-0 font-display text-[1.4rem] leading-[1.08]">“{t('memories.sample1')}”</p>
      </article>
      <div className="mt-7 grid grid-cols-2 gap-4 [&>article:first-child]:pt-7">
        <article><div className="relative"><img className="aspect-[4/5] w-full rounded-2xl object-cover" alt={t('memories.sample2Alt')} src="/images/poetry-book.jpg" /><span className="absolute top-2.5 left-2.5 grid size-[26px] place-items-center rounded-full bg-[rgb(251_248_241/92%)] text-persimmon-seal"><Heart size={13} /></span></div><strong className="mt-2 block font-mono text-[.6rem] tracking-[.03em]">{sampleDate(19)} · {t('mood.good').toUpperCase()}</strong><p className="mt-[5px] mb-0 font-display text-[.86rem] leading-[1.4]">“{t('memories.sample2')}”</p></article>
        <article><div className="relative"><img className="aspect-[4/5] w-full rounded-2xl object-cover" alt={t('memories.sample3Alt')} src="/images/clementine-table.jpg" /><span className="absolute top-2.5 left-2.5 grid size-[26px] place-items-center rounded-full bg-[rgb(251_248_241/92%)] text-persimmon-seal"><Sun size={13} /></span></div><strong className="mt-2 block font-mono text-[.6rem] tracking-[.03em]">{sampleDate(15)} · {t('mood.alive').toUpperCase()}</strong><p className="mt-[5px] mb-0 font-display text-[.86rem] leading-[1.4]">“{t('memories.sample3')}”</p></article>
      </div>
      <div className="grid min-h-[180px] place-items-center content-center text-center"><span className="mb-3 grid size-[34px] place-items-center rounded-full bg-raised-paper shadow-[0_4px_12px_rgb(75_60_44/8%)]"><BookOpen size={16} /></span><strong className="font-mono text-[.62rem] tracking-[.06em] uppercase">{t('memories.waiting')}</strong><p className="mt-[7px] mb-0 max-w-[32ch] font-display text-[.8rem] italic text-[#81786f]">{t('memories.examples')}</p></div>
    </div>
  );
}
