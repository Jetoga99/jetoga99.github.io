import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CONTACT_ENDPOINT, CONTACT_FORM_ENABLED, PROFILE } from './data.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: '', email: '', type: 0, message: '', honey: '' };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'name';
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'email';
  if (values.message.trim().length < 10) errors.message = 'message';
  return errors;
}

function CopyEmail() {
  const { t } = useTranslation('global');
  const [label, setLabel] = useState(null);
  const emailRef = useRef(null);

  const flash = (key) => {
    setLabel(key);
    setTimeout(() => setLabel(null), 1800);
  };
  const selectEmail = () => {
    const range = document.createRange();
    range.selectNodeContents(emailRef.current);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    flash('selected');
  };
  const copy = () => {
    if (!navigator.clipboard) return selectEmail();
    navigator.clipboard.writeText(PROFILE.email).then(() => flash('copied'), selectEmail);
  };

  return (
    <div className="mail">
      <a ref={emailRef} href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
      <button type="button" onClick={copy}>{t(`contact.${label ?? 'copy'}`)}</button>
    </div>
  );
}

function ContactForm() {
  const { t } = useTranslation('global');
  const types = t('contact.form.types', { returnObjects: true });
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [sentTo, setSentTo] = useState('');

  const update = (field) => (e) => {
    const value = field === 'type' ? Number(e.target.value) : e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    // Campo trampa para bots: si viene lleno, se descarta sin enviar
    if (values.honey) return;

    setStatus('sending');
    const type = types[values.type];
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          motivo: type,
          message: values.message.trim(),
          _replyto: values.email.trim(),
          _subject: `jetoga.dev · ${type} · ${values.name.trim()}`,
          _template: 'table',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || res.statusText);
      setSentTo(values.email.trim());
      setValues(EMPTY);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="form-card" role="status">
        <p className="form-ok">{t('contact.form.success', { email: sentTo })}</p>
        <button type="button" className="btn ghost" onClick={() => setStatus('idle')}>{t('contact.form.again')}</button>
      </div>
    );
  }

  const fieldProps = (field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange: update(field),
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
  });
  const fieldError = (field) => errors[field] && (
    <span className="field-error" id={`contact-${field}-error`}>{t(`contact.form.errors.${field}`)}</span>
  );

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <h3>{t('contact.form.title')}</h3>
      <div className="field-row">
        <label className="field">
          <span>{t('contact.form.name')}</span>
          <input type="text" autoComplete="name" {...fieldProps('name')} />
          {fieldError('name')}
        </label>
        <label className="field">
          <span>{t('contact.form.email')}</span>
          <input type="email" autoComplete="email" {...fieldProps('email')} />
          {fieldError('email')}
        </label>
      </div>
      <label className="field">
        <span>{t('contact.form.type')}</span>
        <select {...fieldProps('type')}>
          {types.map((label, i) => <option key={label} value={i}>{label}</option>)}
        </select>
      </label>
      <label className="field">
        <span>{t('contact.form.message')}</span>
        <textarea rows="6" placeholder={t('contact.form.messagePlaceholder')} {...fieldProps('message')} />
        {fieldError('message')}
      </label>
      <input className="honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" value={values.honey} onChange={update('honey')} />
      {status === 'error' && (
        <p className="form-error" role="alert">{t('contact.form.error', { email: PROFILE.email })}</p>
      )}
      <button className="btn primary" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
      </button>
    </form>
  );
}

export function Contact() {
  const { t } = useTranslation('global');

  return (
    <section id="contacto" className="contact">
      <div className={CONTACT_FORM_ENABLED ? 'wrap contact-grid' : 'wrap contact-solo'}>
        <div className="contact-intro">
          <span className="eyebrow">{t('contact.eyebrow')}</span>
          <h2>{t('contact.title')}</h2>
          <p>{t('contact.intro')}</p>
          <p className="direct">{t(CONTACT_FORM_ENABLED ? 'contact.direct' : 'contact.directOnly')}</p>
          <CopyEmail />
          <div className="social">
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
        </div>
        {CONTACT_FORM_ENABLED && <ContactForm />}
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useTranslation('global');
  return (
    <footer>
      <div className="wrap">jetoga.dev · {PROFILE.name} · {t('footer.location')}</div>
    </footer>
  );
}
