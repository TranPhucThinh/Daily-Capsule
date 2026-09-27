import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Bookmark, Camera, Check, ChevronLeft, ChevronRight, Cloud, CloudOff, LoaderCircle, MapPin, MoreHorizontal, Pencil, RotateCw, Trash2, X } from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MOOD_LABEL_KEYS, MoodGlyph } from '../components/ui/MoodGlyph';
import { capsuleService } from '../features/capsules/capsuleService';
import { prepareCapsuleImage } from '../features/capsules/image';
import { MOODS, type Mood } from '../features/capsules/types';
import { useObjectUrl } from '../features/capsules/useObjectUrl';
import { useI18n } from '../i18n/I18nProvider';
import { useAuth } from '../features/auth/AuthProvider';

export function CapsuleDetailPage() {
  const { locale, t } = useI18n();
  const { user } = useAuth();
  const { date } = useParams();
  const navigate = useNavigate();
  const capsule = useLiveQuery(() => date ? capsuleService.getByDate(date, user?.id) : undefined, [date, user?.id]);
  const imageUrl = useObjectUrl(capsule?.imageBlob, capsule?.imagePath);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [mood, setMood] = useState<Mood>('good');
  const [note, setNote] = useState('');
  const [newImage, setNewImage] = useState<Blob>();
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const newImageUrl = useObjectUrl(newImage);

  function startEditing() {
    if (!capsule) return;
    setMood(capsule.mood);
    setNote(capsule.note);
    setNewImage(undefined);
    setError('');
    setMenuOpen(false);
    setEditing(true);
  }

  async function changeImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    setIsPreparing(true);
    try {
      setNewImage(await prepareCapsuleImage(file));
    } catch {
      setError(t('today.photoError'));
    } finally {
      setIsPreparing(false);
    }
  }

  async function saveChanges() {
    if (!capsule || !note.trim()) {
      setError(t('today.noteRequired'));
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      await capsuleService.update(capsule.id, { mood, note, imageBlob: newImage, imageAlt: note.trim() });
      setEditing(false);
    } catch {
      setError(t('detail.saveError'));
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteCapsule() {
    if (!capsule) return;
    setIsDeleting(true);
    setError('');
    try {
      await capsuleService.remove(capsule);
      navigate('/memories', { replace: true });
    } catch {
      setError(t('detail.deleteError'));
      setIsDeleting(false);
    }
  }

  async function retrySync() {
    if (!capsule) return;
    await capsuleService.retrySync(capsule.id);
  }

  if (capsule === undefined) {
    return <div className="min-h-[75dvh] animate-[shimmer_1.6s_ease_infinite] rounded-[22px] bg-[linear-gradient(110deg,#eee9e0_20%,#f7f4ed_40%,#eee9e0_60%)] bg-[length:200%_100%]" aria-label={t('detail.loading')} />;
  }

  if (!capsule) {
    return <section className="grid min-h-[70dvh] place-items-center content-center gap-3.5 text-center md:mx-auto md:max-w-[440px]"><p className="m-0 mb-2.5 font-mono text-[.63rem] tracking-[.08em] text-[#81796f] uppercase">{t('detail.title')}</p><h1 className="m-0 max-w-[12ch] font-display text-[2.7rem] leading-[.98] font-normal">{t('detail.unwritten')}</h1><Link className="font-mono text-[.67rem] tracking-[.04em] text-[#b15f44] uppercase underline-offset-4" to="/memories">{t('detail.return')}</Link></section>;
  }

  const capsuleDate = new Date(`${capsule.date}T12:00:00`);

  return (
    <section className="-mx-5 md:mx-0 md:grid md:min-h-[calc(100dvh-56px)] md:grid-cols-[minmax(0,1.35fr)_minmax(320px,.85fr)] md:grid-rows-[auto_1fr_auto] md:gap-x-9 md:p-9">
      <header className="grid h-14 grid-cols-[44px_1fr_44px] items-center px-5 md:col-span-full"><Link className="grid size-11 place-items-center bg-transparent" aria-label={t('detail.back')} to="/memories"><ArrowLeft size={19} /></Link><span className="font-mono text-[.68rem] tracking-[.08em] uppercase">{t('detail.title')}</span><span className="relative"><button className="grid size-11 place-items-center border-0 bg-transparent" aria-expanded={menuOpen} aria-label={t('detail.more')} onClick={() => setMenuOpen((value) => !value)} type="button"><MoreHorizontal size={19} /></button>{menuOpen ? <span className="absolute top-11 right-0 z-10 grid min-w-44 overflow-hidden rounded-xl bg-raised-paper py-1 shadow-[0_10px_25px_rgb(75_60_44/18%)]"><button className="flex items-center gap-2 px-4 py-3 text-left font-display text-sm" onClick={startEditing} type="button"><Pencil size={15} />{t('detail.edit')}</button><button className="flex items-center gap-2 px-4 py-3 text-left font-display text-sm text-[#a34632]" onClick={() => { setMenuOpen(false); setConfirmingDelete(true); }} type="button"><Trash2 size={15} />{t('detail.delete')}</button></span> : null}</span></header>
      {imageUrl ? <img alt={capsule.imageAlt || capsule.note} className="mx-5 block aspect-[4/5] w-[calc(100%-40px)] rounded-[23px] object-cover md:col-start-1 md:row-start-2 md:row-end-4 md:m-0 md:h-[min(70dvh,720px)] md:w-full" src={imageUrl} /> : null}
      <div className="p-5 md:col-start-2 md:row-start-2 md:self-center">
        <div className="flex items-center justify-between font-mono text-[.56rem] tracking-[.02em] text-[#746d64] uppercase"><span className="flex items-center gap-[5px]"><i className="size-1.5 rounded-full bg-persimmon-seal" />{new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(capsuleDate).toUpperCase()} · {new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(capsule.sealedAt))}</span><em className="not-italic text-[#b15f44]">{t(MOOD_LABEL_KEYS[capsule.mood])}</em></div>
        <blockquote className="mt-7 mb-5 font-display text-[1.55rem] leading-[1.08]">“{capsule.note}”</blockquote>
        <p className="m-0 font-display text-[.98rem] leading-[1.65]">{t('detail.description')}</p>
        <div className="mt-8 flex items-center gap-2 font-mono text-[.58rem] tracking-[.05em] text-[#81796f]"><MapPin size={15} /><span>{t('detail.archive')}</span></div>
        <SyncStatus capsule={capsule} onRetry={retrySync} t={t} />
      </div>
      <footer className="mx-5 grid grid-cols-[1fr_auto_1fr] border-t border-hairline-linen py-6 pb-3 md:col-start-2 md:row-start-3"><button className="flex min-h-11 items-center justify-center gap-1 border-0 bg-transparent font-display text-xs text-[#81796f]" disabled><ChevronLeft size={16} /> {t('detail.previous')}</button><button className="size-[42px] rounded-full border-0 bg-raised-paper text-persimmon-seal shadow-[0_5px_14px_rgb(75_60_44/8%)]" aria-label={t('detail.keepsake')}><Bookmark className="mx-auto" size={17} /></button><button className="flex min-h-11 items-center justify-center gap-1 border-0 bg-transparent font-display text-xs text-[#81796f]" disabled>{t('detail.next')} <ChevronRight size={16} /></button></footer>
      {editing ? <section aria-labelledby="edit-capsule-title" className="fixed inset-0 z-20 grid place-items-end bg-[rgb(45_39_33/35%)] p-3 md:place-items-center" role="dialog" aria-modal="true"><div className="max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-[25px] bg-[#faf7f1] p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-normal" id="edit-capsule-title">{t('detail.editTitle')}</h2><button className="grid size-10 place-items-center rounded-full border-0 bg-[#eee8df]" aria-label={t('detail.cancel')} onClick={() => setEditing(false)} type="button"><X size={18} /></button></div><button className="relative mt-5 block aspect-[4/5] w-full overflow-hidden rounded-[17px] bg-[#eee8df]" disabled={isPreparing} onClick={() => inputRef.current?.click()} type="button">{newImageUrl || imageUrl ? <img className="size-full object-cover" alt={note} src={newImageUrl || imageUrl} /> : null}<span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-[rgb(27_23_19/53%)] py-3 font-display text-sm text-white"><Camera size={16} />{isPreparing ? t('today.preparingPhoto') : t('detail.changePhoto')}</span></button><input accept="image/*" hidden onChange={changeImage} ref={inputRef} type="file" /><div className="mt-5 grid grid-cols-5 gap-1">{MOODS.map((option) => <button aria-label={t(MOOD_LABEL_KEYS[option])} aria-pressed={mood === option} className={`grid h-[62px] place-items-center rounded-xl border-0 ${mood === option ? 'bg-[#eee8df] text-persimmon-seal' : 'bg-transparent text-[#82786d]'}`} key={option} onClick={() => setMood(option)} type="button"><MoodGlyph mood={option} /></button>)}</div><label className="mt-5 block"><span className="font-display text-sm">{t('today.oneSentence')}</span><textarea className="mt-2 min-h-24 w-full rounded-[15px] border-0 bg-[#eee8df] p-3 font-display text-base leading-[1.45] outline-0" maxLength={180} onChange={(event) => setNote(event.target.value)} value={note} /></label>{error ? <p className="mt-2 mb-0 text-sm text-[#a34632]">{error}</p> : null}<div className="mt-5 grid grid-cols-2 gap-3"><button className="min-h-12 rounded-full border border-[#d8cfc3] bg-transparent font-display text-sm" onClick={() => setEditing(false)} type="button">{t('detail.cancel')}</button><button className="min-h-12 rounded-full border-0 bg-persimmon-seal font-display text-sm text-white disabled:opacity-60" disabled={isSaving || isPreparing} onClick={saveChanges} type="button">{isSaving ? t('detail.saving') : t('detail.save')}</button></div></div></section> : null}
      {confirmingDelete ? <section aria-labelledby="delete-capsule-title" className="fixed inset-0 z-20 grid place-items-center bg-[rgb(45_39_33/35%)] p-5" role="dialog" aria-modal="true"><div className="w-full max-w-sm rounded-[23px] bg-[#faf7f1] p-6 text-center shadow-2xl"><span className="mx-auto grid size-11 place-items-center rounded-full bg-[#f4e4de] text-[#a34632]"><Trash2 size={19} /></span><h2 className="mt-4 font-display text-2xl font-normal" id="delete-capsule-title">{t('detail.deleteTitle')}</h2><p className="mt-2 font-display text-sm leading-[1.5] text-[#71685e]">{t('detail.deleteDescription')}</p>{error ? <p className="mt-2 text-sm text-[#a34632]">{error}</p> : null}<div className="mt-6 grid grid-cols-2 gap-3"><button className="min-h-11 rounded-full border border-[#d8cfc3] bg-transparent font-display text-sm" disabled={isDeleting} onClick={() => setConfirmingDelete(false)} type="button">{t('detail.cancel')}</button><button className="min-h-11 rounded-full border-0 bg-[#a34632] font-display text-sm text-white disabled:opacity-60" disabled={isDeleting} onClick={deleteCapsule} type="button">{isDeleting ? t('detail.deleting') : t('detail.confirmDelete')}</button></div></div></section> : null}
    </section>
  );
}

function SyncStatus({ capsule, onRetry, t }: { capsule: NonNullable<Awaited<ReturnType<typeof capsuleService.getByDate>>>; onRetry: () => Promise<void>; t: ReturnType<typeof useI18n>['t'] }) {
  const status = capsule.syncStatus;
  const icon = status === 'error' ? <CloudOff size={14} /> : status === 'syncing' ? <LoaderCircle className="animate-spin" size={14} /> : status === 'synced' ? <Check size={14} /> : <Cloud size={14} />;
  const color = status === 'error' ? 'text-[#a34632] bg-[#f7e8e2]' : status === 'synced' ? 'text-[#547462] bg-[#e7efe8]' : 'text-[#756d64] bg-[#eee9e1]';

  return <div aria-live="polite" className={`mt-4 inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 font-mono text-[.58rem] tracking-[.04em] uppercase ${color}`}>{icon}<span>{t(`sync.${status}`)}</span>{status === 'error' ? <button className="ml-1 inline-flex items-center gap-1 border-0 bg-transparent p-0 font-mono text-[.58rem] font-semibold underline underline-offset-2" onClick={() => void onRetry()} type="button"><RotateCw size={12} />{t('sync.retry')}</button> : null}</div>;
}
