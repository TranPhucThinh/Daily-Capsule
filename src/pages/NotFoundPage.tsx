import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider';

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <section className="grid min-h-[70dvh] place-items-center content-center gap-3.5 text-center md:mx-auto md:max-w-[440px]">
      <p className="m-0 mb-2.5 font-mono text-[.63rem] tracking-[.08em] text-[#81796f] uppercase">404</p>
      <h1 className="m-0 max-w-[12ch] font-display text-[2.7rem] leading-[.98] font-normal">{t('notFound.title')}</h1>
      <Link className="font-mono text-[.67rem] tracking-[.04em] text-[#b15f44] uppercase underline-offset-4" to="/">
        {t('notFound.return')}
      </Link>
    </section>
  );
}
