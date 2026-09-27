import { type FormEvent, useState } from 'react';
import { PageIntro } from '../components/ui/PageIntro';
import { useAuth } from '../features/auth/AuthProvider';
import { type Language, useI18n } from '../i18n/I18nProvider';

export function SettingsPage() {
  const { language, setLanguage, t } = useI18n();
  const { configured, loading, signOut, sendMagicLink, user } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setMessage('');
    setIsSubmitting(true);
    try {
      await sendMagicLink(email.trim());
      setMessage(t('settings.linkSent', { email: email.trim() }));
    } catch {
      setMessage(t('settings.authError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setMessage('');
    try {
      await signOut();
    } catch {
      setMessage(t('settings.signOutError'));
    }
  }

  return (
    <section className="md:mx-auto md:max-w-[440px]">
      <PageIntro
        eyebrow="Daily Capsule"
        title={t('settings.title')}
        description={t('settings.description')}
      />
      <div className="border-t border-hairline-linen">
        <div className="flex items-center justify-between gap-[18px] border-b border-hairline-linen py-5">
          <span className="grid min-w-0 gap-1"><strong className="font-display font-normal">{t('settings.language')}</strong><small className="text-xs text-faded-ink">{t('settings.languageDescription')}</small></span>
          <div className="flex shrink-0 rounded-full border border-hairline-linen bg-[#e9e3d9] p-[3px]" role="group" aria-label={t('settings.language')}>
            {(['vi', 'en'] as Language[]).map((option) => (
              <button aria-label={option === 'vi' ? t('settings.vietnamese') : t('settings.english')} aria-pressed={language === option} className={`h-[30px] min-w-[38px] rounded-full border-0 px-[9px] font-mono text-[.63rem] tracking-[.04em] ${language === option ? 'bg-persimmon-seal text-[#fffaf2] shadow-[0_2px_8px_rgb(156_75_47/22%)]' : 'bg-transparent text-faded-ink'}`} key={option} onClick={() => setLanguage(option)} title={option === 'vi' ? t('settings.vietnamese') : t('settings.english')} type="button">
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <SettingRow title={t('settings.localArchive')} description={t('settings.localDescription')} value={t('settings.active')} />
        <AccountPanel
          configured={configured}
          email={email}
          isSubmitting={isSubmitting}
          loading={loading}
          message={message}
          onEmailChange={setEmail}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          t={t}
          userEmail={user?.email}
        />
        <SettingRow title={t('settings.appearance')} description={t('settings.appearanceDescription')} value={t('settings.light')} />
      </div>
    </section>
  );
}

function AccountPanel({ configured, email, isSubmitting, loading, message, onEmailChange, onSignIn, onSignOut, t, userEmail }: {
  configured: boolean;
  email: string;
  isSubmitting: boolean;
  loading: boolean;
  message: string;
  onEmailChange: (email: string) => void;
  onSignIn: (event: FormEvent<HTMLFormElement>) => void;
  onSignOut: () => void;
  t: ReturnType<typeof useI18n>['t'];
  userEmail?: string;
}) {
  return (
    <div className="border-b border-hairline-linen py-5">
      <div className="flex items-start justify-between gap-4">
        <span className="grid min-w-0 gap-1"><strong className="font-display font-normal">{t('settings.account')}</strong><small className="text-xs text-faded-ink">{userEmail || t('settings.accountDescription')}</small></span>
        <em className="shrink-0 rounded-xl bg-[#e9e3d9] px-[9px] py-[5px] text-xs not-italic text-faded-ink">{loading ? t('settings.checking') : userEmail ? t('settings.connected') : t('settings.cloudSync')}</em>
      </div>
      {configured && !loading && !userEmail ? (
        <form className="mt-3 flex gap-2" onSubmit={onSignIn}>
          <input aria-label={t('settings.email')} className="min-w-0 flex-1 rounded-xl border border-hairline-linen bg-raised-paper px-3 py-2 text-sm outline-none focus:border-persimmon-seal" onChange={(event) => onEmailChange(event.target.value)} placeholder={t('settings.emailPlaceholder')} type="email" value={email} />
          <button className="shrink-0 rounded-xl bg-persimmon-seal px-3 py-2 text-xs font-semibold text-[#fffaf2] disabled:opacity-65" disabled={isSubmitting} type="submit">{isSubmitting ? t('settings.sendingLink') : t('settings.sendLink')}</button>
        </form>
      ) : null}
      {configured && !loading && userEmail ? <button className="mt-3 text-xs text-persimmon-seal underline underline-offset-4" onClick={onSignOut} type="button">{t('settings.signOut')}</button> : null}
      {message ? <p className="mt-2 mb-0 text-xs text-faded-ink" role="status">{message}</p> : null}
    </div>
  );
}

function SettingRow({ title, description, value }: { title: string; description: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-hairline-linen py-5">
      <span className="grid min-w-0 gap-1"><strong className="font-display font-normal">{title}</strong><small className="text-xs text-faded-ink">{description}</small></span>
      <em className="shrink-0 rounded-xl bg-[#e9e3d9] px-[9px] py-[5px] text-xs not-italic text-faded-ink">{value}</em>
    </div>
  );
}
