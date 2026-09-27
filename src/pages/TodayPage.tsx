import { useLiveQuery } from 'dexie-react-hooks'
import { Camera, Expand, ScanLine, Stamp } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type ChangeEvent, useMemo, useRef, useState } from 'react'
import { SealMark } from '../components/brand/SealMark'

import { MOOD_LABEL_KEYS, MoodGlyph } from '../components/ui/MoodGlyph'
import { capsuleService } from '../features/capsules/capsuleService'
import { prepareCapsuleImage } from '../features/capsules/image'
import { MOODS, type Mood } from '../features/capsules/types'
import { useObjectUrl } from '../features/capsules/useObjectUrl'
import { useI18n } from '../i18n/I18nProvider'
import { useAuth } from '../features/auth/AuthProvider'
import { getTodayParts } from '../lib/date'

export function TodayPage() {
  const { locale, t } = useI18n()
  const { user } = useAuth()
  const today = useMemo(() => getTodayParts(locale), [locale])
  const existingCapsule = useLiveQuery(
    () => capsuleService.getByDate(today.dateKey, user?.id),
    [today.dateKey, user?.id],
  )
  const [mood, setMood] = useState<Mood>('good')
  const [note, setNote] = useState('')
  const [imageBlob, setImageBlob] = useState<Blob>()
  const [imageName, setImageName] = useState('')
  const [isPreparing, setIsPreparing] = useState(false)
  const [isSealing, setIsSealing] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const draftImageUrl = useObjectUrl(imageBlob)

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setIsPreparing(true)
    try {
      const compressed = await prepareCapsuleImage(file)
      setImageBlob(compressed)
      setImageName(file.name)
    } catch {
      setError(t('today.photoError'))
    } finally {
      setIsPreparing(false)
    }
  }

  async function handleSeal() {
    if (!imageBlob) {
      setError(t('today.photoRequired'))
      return
    }
    if (!note.trim()) {
      setError(t('today.noteRequired'))
      return
    }

    setError('')
    setIsSealing(true)
    try {
      await capsuleService.seal({
        date: today.dateKey,
        userId: user?.id,
        imageAlt: note.trim(),
        imageBlob,
        mood,
        note,
      })
    } catch {
      setError(t('today.sealError'))
    } finally {
      setIsSealing(false)
    }
  }

  if (existingCapsule) {
    return <SealedToday capsule={existingCapsule} />
  }

  return (
    <motion.section
      animate={{ opacity: 1 }}
      className="py-2 pb-3 md:mx-auto md:max-w-[440px]"
      initial={{ opacity: 0 }}
    >
      <div className="flex h-[70px] items-end gap-[18px]">
        <span className="font-display text-[5rem] leading-[.76] tracking-[-.055em]">{today.day}</span>
        <span className="pb-[3px] font-mono text-[.68rem] leading-[1.55] tracking-[.05em] text-[#625b53] uppercase">
          {today.month}
          <br />
          {today.weekday}
        </span>
      </div>

      <h1 className="my-5 mb-7 font-display text-[2rem] leading-[1.02] font-normal tracking-[-.025em]">
        {t('today.prompt')
          .split('<br />')
          .map((line, index) => (
            <span key={line}>
              {index ? <br /> : null}
              {line}
            </span>
          ))}
      </h1>

      <section className="rounded-[26px] bg-raised-paper px-[22px] pt-5 pb-3.5 shadow-[0_16px_34px_rgb(75_60_44/7%)]">
        <div className="flex items-center justify-between font-mono text-[.6rem] tracking-[.07em] text-[#a1998e] uppercase">
          <span>{t('today.plate')}</span>
          <span>35mm · 1/250s</span>
        </div>
        <button
          className={`relative grid min-h-[212px] w-full place-items-center overflow-hidden rounded-[18px] border-0 bg-[#f3f0e9] p-0 transition-[color,background-color,transform,box-shadow] duration-[180ms] ${draftImageUrl ? 'mt-4 mb-5' : 'mt-9 mb-5'}`}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          {draftImageUrl ? (
            <img className="min-h-[250px] h-full w-full object-cover" alt={t('today.previewAlt')} src={draftImageUrl} />
          ) : (
            <span className="grid place-items-center gap-[5px] text-[#5d564e]">
              <span className="mb-[7px] grid size-12 place-items-center rounded-full bg-raised-paper text-persimmon-seal shadow-[0_5px_12px_rgb(70_54_41/8%)]">
                <Camera aria-hidden="true" size={22} strokeWidth={1.4} />
              </span>
              <strong className="font-display text-[.95rem] font-normal">
                {isPreparing
                  ? t('today.preparingPhoto')
                  : t('today.selectPhoto')}
              </strong>
              <small className="font-display text-xs text-[#9b9388]">{t('today.photoHint')}</small>
            </span>
          )}
        </button>
        <div className="flex items-center justify-between font-mono text-[.6rem] tracking-[.07em] text-[#a1998e] uppercase">
          <span>{t('today.archivalMatte')}</span>
          <Expand aria-hidden="true" size={14} />
        </div>
        <input
          accept="image/*"
          hidden
          onChange={handleImageChange}
          ref={inputRef}
          type="file"
        />
      </section>

      <fieldset className="mt-8 min-w-0 border-0 p-0">
        <legend className="flex w-full items-baseline justify-between font-mono text-[.65rem] tracking-[.06em] text-faded-ink uppercase">
          <span>{t('today.attunement')}</span>
          <em className="font-display text-xs font-normal tracking-[.03em] normal-case">{t('today.resonance')}</em>
        </legend>
        <div className="mt-2.5 grid grid-cols-5 gap-1">
          {MOODS.map((option) => (
            <button
              aria-pressed={mood === option}
              className={`grid h-20 min-w-0 place-items-center content-center gap-2 rounded-[14px] border-0 px-0.5 py-2 font-display text-xs transition-[color,background-color,transform,box-shadow] duration-[180ms] ${mood === option ? 'bg-raised-paper text-[#bd5c3c] shadow-[0_6px_16px_rgb(75_60_44/9%)]' : 'bg-transparent text-[#80786f]'}`}
              key={option}
              onClick={() => setMood(option)}
              type="button"
            >
              <span className={`grid size-[38px] place-items-center ${mood === option ? 'rounded-xl border border-[#e8ded2]' : ''}`}>
                <MoodGlyph mood={option} />
              </span>
              {t(MOOD_LABEL_KEYS[option])}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-[22px] block">
        <span className="flex items-baseline justify-between font-display text-[.82rem] text-[#3f3933]">
          <strong className="font-normal">{t('today.oneSentence')}</strong>
          <em className="text-xs text-[#8b8379]">{t('today.restraint')}</em>
        </span>
        <span className="mt-2 block rounded-[17px] bg-raised-paper px-4 pt-4 pb-3 shadow-[0_5px_16px_rgb(75_60_44/5%)]">
          <textarea
            className="min-h-[72px] w-full resize-y border-0 bg-transparent font-display text-base leading-[1.55] text-[#3e3934] outline-0 placeholder:text-[#b0a99f]"
            maxLength={180}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t('today.placeholder')}
            rows={3}
            value={note}
          />
          <span className="flex items-center justify-between font-mono text-[.6rem] tracking-[.03em] text-[#9a9288]">
            <span className="inline-flex min-w-0 flex-1 items-center gap-[5px] overflow-hidden text-ellipsis whitespace-nowrap" title={imageName || undefined}>
              <ScanLine aria-hidden="true" size={13} />{' '}
              {imageName || t('today.archivalNote')}
            </span>
            <span className="inline-flex shrink-0 items-center gap-[5px]">{note.length} / 180</span>
          </span>
        </span>
      </label>

      <AnimatePresence>
        {error ? (
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mx-1 mt-3 mb-0 text-xs text-[#9e3f32]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: -4 }}
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <button
        className="mt-7 flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full border-0 bg-persimmon-seal text-[.82rem] font-semibold text-[#fffaf2] shadow-[0_8px_22px_rgb(156_75_47/24%)] transition-[color,background-color,transform,box-shadow] duration-[180ms] active:translate-y-px active:scale-[.985] disabled:cursor-wait disabled:opacity-65"
        disabled={isPreparing || isSealing}
        onClick={handleSeal}
        type="button"
      >
        <Stamp aria-hidden="true" size={18} />
        <span>{isSealing ? t('today.sealing') : t('today.seal')}</span>
        <small className="border-l border-[rgb(255_255_255/35%)] pl-[9px] font-mono text-[.62rem] font-normal tracking-[.06em] uppercase">
          {today.day} · {today.month}
        </small>
      </button>
    </motion.section>
  )
}

function SealedToday({
  capsule,
}: {
  capsule: NonNullable<Awaited<ReturnType<typeof capsuleService.getByDate>>>
}) {
  const { locale, t } = useI18n()
  const imageUrl = useObjectUrl(capsule.imageBlob, capsule.imagePath)
  const sealedTime = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(capsule.sealedAt))
  const date = new Date(`${capsule.date}T12:00:00`)

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="py-[18px] pb-6 md:mx-auto md:max-w-[440px]"
      initial={{ opacity: 0, y: 12 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="flex items-center justify-between font-mono text-[.65rem] tracking-[.06em] text-[#675f57]">
        <span>
          {new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: 'short',
            weekday: 'long',
          })
            .format(date)
            .toUpperCase()}
        </span>
        <span className="flex items-center gap-1.5 uppercase">
          <i className="size-1.5 rounded-full bg-persimmon-seal" />
          <span>{t(MOOD_LABEL_KEYS[capsule.mood])}</span>
        </span>
      </div>
      {imageUrl ? (
        <img
          alt={capsule.imageAlt || capsule.note}
          className="mt-[17px] aspect-[4/5] w-full rounded-3xl object-cover"
          src={imageUrl}
        />
      ) : null}
      <blockquote className="my-6 font-display text-[1.9rem] leading-[1.08] tracking-[-.025em]">“{capsule.note}”</blockquote>
      <div className="my-5 mt-[30px] h-px w-12 bg-hairline-linen" />
      <div className="grid grid-cols-[40px_1fr_auto] items-center gap-3">
        <SealMark className="!size-10" />
        <span className="grid gap-0.5">
          <strong className="font-display text-base">{t('today.sealed')}</strong>
          <small className="font-mono text-[.6rem] tracking-[.04em] text-[#877e74] uppercase">{t('today.sealedAt', { time: sealedTime })}</small>
        </span>
        <Stamp className="text-persimmon-seal" aria-hidden="true" size={18} />
      </div>
      <div className="mt-[30px] flex justify-between font-display text-[.78rem] text-[#746d65]">
        <span>{t('today.savedLocal')}</span>
        <span>{t('today.offlineReady')}</span>
      </div>
    </motion.article>
  )
}
