'use client';

import { Suspense, useEffect, useId, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';

import Header from '@/components/Header';
import { getProduct, submitInquiry } from '@/lib/api';
import { EASE } from '@/lib/motion';
import '@/styles/public.css';
import '@/styles/forms.css';

function FloatingField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required,
  textarea,
  readOnly,
}: {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  readOnly?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const float = focused || value.length > 0;
  const className = `float-field${focused ? ' is-focused' : ''}${float ? ' is-float' : ''}`;
  const shared = {
    id,
    className: 'float-field__input',
    value,
    required,
    readOnly,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  return (
    <div className={className}>
      {textarea ? (
        <textarea {...shared} onChange={(e) => onChange?.(e.target.value)} />
      ) : (
        <input
          {...shared}
          type={type}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
      <label htmlFor={id} className="float-field__label">
        {label}
      </label>
    </div>
  );
}

function SuccessCheck() {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 48 48" className="success-check" aria-hidden="true">
      <motion.circle
        cx="24"
        cy="24"
        r="20"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: EASE.standard }}
      />
      <motion.path
        d="M15 25l6 6 12-13"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.4, ease: EASE.standard }}
      />
    </svg>
  );
}

function ContactInner() {
  const t = useTranslations('Contact');
  const uid = useId();
  const params = useSearchParams();
  const carpetId = params.get('carpet');
  const carpetPk = carpetId && /^\d+$/.test(carpetId) ? Number(carpetId) : null;

  const [carpetName, setCarpetName] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [state, setState] = useState<
    'idle' | 'sending' | 'done' | 'error' | 'invalid'
  >('idle');

  useEffect(() => {
    if (carpetPk === null) return;
    getProduct(carpetPk)
      .then((data) => setCarpetName(data.title))
      .catch(() => setCarpetName(null));
  }, [carpetPk]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setState('invalid');
      return;
    }
    setState('sending');
    try {
      await submitInquiry({ ...form, carpet: carpetPk });
      setState('done');
    } catch {
      setState('error');
    }
  };

  return (
    <main className="pub-root">
      <Header />
      <div className="pub-wrap">
        <div className="pub-hero">
          <h1 className="pub-display pub-hero__title">{t('title')}</h1>
          <p className="pub-hero__sub">{t('subtitle')}</p>
        </div>

        {state === 'done' ? (
          <motion.div
            className="pub-success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE.standard }}
          >
            <SuccessCheck />
            <h2
              className="pub-display"
              style={{ fontSize: '1.6rem', marginTop: '1rem' }}
            >
              {t('success')}
            </h2>
            <p className="pub-muted" style={{ marginTop: '0.6rem' }}>
              {t('successNote')}
            </p>
            <button
              type="button"
              className="pub-btn"
              style={{ marginTop: '1.5rem' }}
              onClick={() => {
                setForm({ name: '', email: '', phone: '', message: '' });
                setState('idle');
              }}
            >
              {t('another')}
            </button>
          </motion.div>
        ) : (
          <form
            className="pub-card"
            onSubmit={submit}
            style={{ display: 'grid', gap: '1rem' }}
          >
            <div className="pub-grid-2">
              <FloatingField
                id={`${uid}-name`}
                label={t('name')}
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                required
              />
              <FloatingField
                id={`${uid}-email`}
                label={t('email')}
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
              />
              <FloatingField
                id={`${uid}-phone`}
                label={t('phone')}
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
              <FloatingField
                id={`${uid}-subject`}
                label={t('subject')}
                value={carpetName ?? t('general')}
                readOnly
              />
            </div>

            <FloatingField
              id={`${uid}-message`}
              label={t('message')}
              value={form.message}
              onChange={(v) => setForm({ ...form, message: v })}
              textarea
              required
            />

            {state === 'invalid' && (
              <p className="pub-error">{t('required')}</p>
            )}
            {state === 'error' && <p className="pub-error">{t('error')}</p>}

            <button
              className="pub-btn"
              type="submit"
              disabled={state === 'sending'}
            >
              {state === 'sending' ? t('sending') : t('submit')}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactInner />
    </Suspense>
  );
}
