import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Bookmark, ChevronLeft, ChevronRight, MapPin, MoreHorizontal } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { MOOD_LABEL_KEYS } from '../components/ui/MoodGlyph';
import { capsuleService } from '../features/capsules/capsuleService';
import { useObjectUrl } from '../features/capsules/useObjectUrl';
import { useI18n } from '../i18n/I18nProvider';
import { useAuth } from '../features/auth/AuthProvider';

export function CapsuleDetailPage() {
  const { locale, t } = useI18n();
  const { user } = useAuth();
  const { date } = useParams();
  const capsule = useLiveQuery(() => date ? capsuleService.getByDate(date, user?.id) : undefined, [date, user?.id]);
  const imageUrl = useObjectUrl(capsule?.imageBlob, capsule?.imagePath);

  if (capsule === undefined) {
    return <div className="min-h-[75dvh] animate-[shimmer_1.6s_ease_infinite] rounded-[22px] bg-[linear-gradient(110deg,#eee9e0_20%,#f7f4ed_40%,#eee9e0_60%)] bg-[length:200%_100%]" aria-label={t('detail.loading')} />;
  }

  if (!capsule) {
    return <section className="grid min-h-[70dvh] place-items-center content-center gap-3.5 text-center md:mx-auto md:max-w-[440px]"><p className="m-0 mb-2.5 font-mono text-[.63rem] tracking-[.08em] text-[#81796f] uppercase">{t('detail.title')}</p><h1 className="m-0 max-w-[12ch] font-display text-[2.7rem] leading-[.98] font-normal">{t('detail.unwritten')}</h1><Link className="font-mono text-[.67rem] tracking-[.04em] text-[#b15f44] uppercase underline-offset-4" to="/memories">{t('detail.return')}</Link></section>;
  }

  const capsuleDate = new Date(`${capsule.date}T12:00:00`);

  return (
    <section className="-mx-5 md:mx-0 md:grid md:min-h-[calc(100dvh-56px)] md:grid-cols-[minmax(0,1.35fr)_minmax(320px,.85fr)] md:grid-rows-[auto_1fr_auto] md:gap-x-9 md:p-9">
      <header className="grid h-14 grid-cols-[44px_1fr_44px] items-center px-5 md:col-span-full"><Link className="grid size-11 place-items-center bg-transparent" aria-label={t('detail.back')} to="/memories"><ArrowLeft size={19} /></Link><span className="font-mono text-[.68rem] tracking-[.08em] uppercase">{t('detail.title')}</span><button className="grid size-11 place-items-center border-0 bg-transparent" aria-label={t('detail.more')}><MoreHorizontal size={19} /></button></header>
      {imageUrl ? <img alt={capsule.imageAlt || capsule.note} className="mx-5 block aspect-[4/5] w-[calc(100%-40px)] rounded-[23px] object-cover md:col-start-1 md:row-start-2 md:row-end-4 md:m-0 md:h-[min(70dvh,720px)] md:w-full" src={imageUrl} /> : null}
      <div className="p-5 md:col-start-2 md:row-start-2 md:self-center">
        <div className="flex items-center justify-between font-mono text-[.56rem] tracking-[.02em] text-[#746d64] uppercase"><span className="flex items-center gap-[5px]"><i className="size-1.5 rounded-full bg-persimmon-seal" />{new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(capsuleDate).toUpperCase()} · {new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(capsule.sealedAt))}</span><em className="not-italic text-[#b15f44]">{t(MOOD_LABEL_KEYS[capsule.mood])}</em></div>
        <blockquote className="mt-7 mb-5 font-display text-[1.55rem] leading-[1.08]">“{capsule.note}”</blockquote>
        <p className="m-0 font-display text-[.98rem] leading-[1.65]">{t('detail.description')}</p>
        <div className="mt-8 flex items-center gap-2 font-mono text-[.58rem] tracking-[.05em] text-[#81796f]"><MapPin size={15} /><span>{t('detail.archive')}</span></div>
      </div>
      <footer className="mx-5 grid grid-cols-[1fr_auto_1fr] border-t border-hairline-linen py-6 pb-3 md:col-start-2 md:row-start-3"><button className="flex min-h-11 items-center justify-center gap-1 border-0 bg-transparent font-display text-xs text-[#81796f]" disabled><ChevronLeft size={16} /> {t('detail.previous')}</button><button className="size-[42px] rounded-full border-0 bg-raised-paper text-persimmon-seal shadow-[0_5px_14px_rgb(75_60_44/8%)]" aria-label={t('detail.keepsake')}><Bookmark className="mx-auto" size={17} /></button><button className="flex min-h-11 items-center justify-center gap-1 border-0 bg-transparent font-display text-xs text-[#81796f]" disabled>{t('detail.next')} <ChevronRight size={16} /></button></footer>
    </section>
  );
}
