import React, { useState } from 'react';
import { ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import { COLOR_TOKENS, TYPOGRAPHY_SCALE } from '../../design-system/tokens';
import {
  Button,
  Card,
  Divider,
  SearchInput,
  SectionHeader,
  SelectInput,
  TextArea,
  TextInput,
} from '../../design-system/ui';
import { useTranslation } from '../../hooks/useTranslation';

export interface DesignSystemShowcaseProps {
  section?: 'tokens' | 'components' | 'all';
}

export function DesignSystemShowcase({ section = 'all' }: DesignSystemShowcaseProps) {
  const { locale, t } = useTranslation();

  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [districtValue, setDistrictValue] = useState(t.system.inputDemoDistrictOptions[0] ?? '');
  const [noteValue, setNoteValue] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleLoadingClick = () => {
    setIsLoadingDemo(true);
    window.setTimeout(() => {
      setIsLoadingDemo(false);
    }, 900);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage(t.system.inputDemoSubmitted);
  };

  const showTokens = section === 'all' || section === 'tokens';
  const showComponents = section === 'all' || section === 'components';

  return (
    <div className="space-y-12">
      {showTokens && (
        <>
          {/* Color Tokens Table */}
          <section className="space-y-6">
            <SectionHeader
              title={t.system.colorsHeading}
              subtitle={t.system.colorsSubheading}
            />

            <Card padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--sm-border-subtle)] bg-[var(--sm-bg-subtle)] text-xs font-semibold text-[var(--sm-text-secondary)]">
                      <th className="py-3 px-4">{t.system.tokenHeaderName}</th>
                      <th className="py-3 px-4">{t.system.tokenHeaderLight}</th>
                      <th className="py-3 px-4">{t.system.tokenHeaderDark}</th>
                      <th className="py-3 px-4">{t.system.tokenHeaderRole}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--sm-border-subtle)] text-sm">
                    {COLOR_TOKENS.map((token) => (
                      <tr key={token.id}>
                        <td className="py-3 px-4 font-mono text-xs text-[var(--sm-text-primary)]">
                          {token.cssVar}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-5 h-5 rounded-[4px] border border-[var(--sm-border-strong)] shrink-0"
                              style={{ backgroundColor: token.lightHex }}
                              aria-hidden="true"
                            />
                            <span className="font-mono text-xs tabular-nums text-[var(--sm-text-secondary)]">
                              {token.lightHex}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-5 h-5 rounded-[4px] border border-[var(--sm-border-strong)] shrink-0"
                              style={{ backgroundColor: token.darkHex }}
                              aria-hidden="true"
                            />
                            <span className="font-mono text-xs tabular-nums text-[var(--sm-text-secondary)]">
                              {token.darkHex}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs font-medium text-[var(--sm-text-muted)]">
                          {token.role}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          <Divider />

          {/* Typography Scale */}
          <section className="space-y-6">
            <SectionHeader
              title={t.system.typographyHeading}
              subtitle={t.system.typographySubheading}
            />

            <Card padding="lg" className="space-y-6">
              {TYPOGRAPHY_SCALE.map((step, index) => {
                const sampleText =
                  locale === 'uz' ? t.system.typographySpecimenUz : t.system.typographySpecimenRu;
                const isDisplay = step.family === 'Playfair Display';
                const isMono = step.family === 'JetBrains Mono';

                return (
                  <div key={step.id}>
                    {index > 0 && <Divider className="mb-6" />}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-baseline">
                      <div className="lg:col-span-4 space-y-1">
                        <p className="text-xs font-semibold text-[var(--sm-text-primary)]">{step.id}</p>
                        <p className="font-mono text-xs text-[var(--sm-text-muted)] tabular-nums">
                          {step.family} · {step.size} · {step.weight}
                        </p>
                      </div>
                      <div className="lg:col-span-8">
                        <p
                          className={[
                            'text-[var(--sm-text-primary)]',
                            isDisplay ? 'font-display' : isMono ? 'font-mono tabular-nums' : 'font-sans',
                          ].join(' ')}
                          style={{
                            fontSize:
                              step.id === 'display-hero'
                                ? 'clamp(1.75rem, 3vw, 2.5rem)'
                                : step.id === 'section-heading'
                                  ? '1.5rem'
                                  : step.id === 'card-title'
                                    ? '1rem'
                                    : step.id === 'tabular-data'
                                      ? '0.875rem'
                                      : step.id === 'metadata'
                                        ? '0.75rem'
                                        : '0.9375rem',
                            fontWeight: Number(step.weight),
                            lineHeight: step.lineHeight,
                          }}
                        >
                          {sampleText}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Card>
          </section>
        </>
      )}

      {showTokens && showComponents && <Divider />}

      {showComponents && (
        <>
          {/* Reusable Buttons Matrix */}
          <section className="space-y-6">
            <SectionHeader
              title={t.system.buttonsHeading}
              subtitle={t.system.buttonsSubheading}
            />

            <Card padding="lg" className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {t.system.buttonVariants.primary}
                </Button>
                <Button variant="secondary">{t.system.buttonVariants.secondary}</Button>
                <Button variant="outline">{t.system.buttonVariants.outline}</Button>
                <Button variant="ghost">{t.system.buttonVariants.ghost}</Button>
                <Button variant="danger">{t.system.buttonVariants.danger}</Button>
                <Button variant="primary" isLoading={isLoadingDemo} onClick={handleLoadingClick}>
                  {t.system.buttonVariants.loading}
                </Button>
              </div>

              <Divider />

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm">
                  sm · 38px
                </Button>
                <Button variant="outline" size="md">
                  md · 42px
                </Button>
                <Button variant="outline" size="lg">
                  lg · 46px
                </Button>
              </div>
            </Card>
          </section>

          <Divider />

          {/* Reusable Inputs & Form Controls */}
          <section className="space-y-6">
            <SectionHeader
              title={t.system.inputsHeading}
              subtitle={t.system.inputsSubheading}
            />

            <Card padding="lg">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <TextInput
                    label={t.system.inputDemoNameLabel}
                    placeholder={t.system.inputDemoNamePlaceholder}
                    hint={t.system.inputDemoNameHint}
                    value={nameValue}
                    onChange={(e) => {
                      setNameValue(e.target.value);
                      setSubmittedMessage(null);
                    }}
                    required
                  />

                  <TextInput
                    label={t.system.inputDemoPhoneLabel}
                    defaultValue="+998 90"
                    error={t.system.inputDemoPhoneError}
                    tabular
                  />

                  <SearchInput
                    label={t.nav.catalog}
                    placeholder={t.system.inputDemoSearchPlaceholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />

                  <SelectInput
                    label={t.system.inputDemoDistrictLabel}
                    value={districtValue}
                    onChange={(e) => setDistrictValue(e.target.value)}
                    options={t.system.inputDemoDistrictOptions.map((district) => ({
                      value: district,
                      label: district,
                    }))}
                  />
                </div>

                <TextArea
                  label={t.system.inputDemoNoteLabel}
                  placeholder={t.system.inputDemoNotePlaceholder}
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" variant="primary" leftIcon={<Check className="w-4 h-4" />}>
                    {t.system.inputDemoSubmit}
                  </Button>

                  {submittedMessage && (
                    <p
                      role="status"
                      className="inline-flex items-center gap-2 text-xs font-medium text-[var(--sm-status-success)]"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{submittedMessage}</span>
                    </p>
                  )}
                </div>
              </form>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
