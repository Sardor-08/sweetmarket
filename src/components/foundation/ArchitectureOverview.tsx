import React from 'react';
import { Card, Divider, SectionHeader } from '../../design-system/ui';
import { useTranslation } from '../../hooks/useTranslation';

export function ArchitectureOverview() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <SectionHeader
          title={t.system.architectureHeading}
          subtitle={t.system.architectureSubheading}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {t.system.stackItems.map((item) => (
            <Card key={item.layer} padding="md" className="space-y-2">
              <h3 className="font-sans text-sm font-semibold text-[var(--sm-text-primary)]">
                {item.layer}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--sm-text-secondary)]">
                {item.detail}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <Divider />

      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-[var(--sm-text-primary)]">
          {t.system.modulesHeading}
        </h3>

        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--sm-border-subtle)] bg-[var(--sm-bg-subtle)] text-xs font-semibold text-[var(--sm-text-secondary)]">
                  <th className="py-3 px-4 w-16">{t.system.moduleTableHeaders.index}</th>
                  <th className="py-3 px-4">{t.system.moduleTableHeaders.module}</th>
                  <th className="py-3 px-4">{t.system.moduleTableHeaders.collection}</th>
                  <th className="py-3 px-4">{t.system.moduleTableHeaders.access}</th>
                  <th className="py-3 px-4">{t.system.moduleTableHeaders.scope}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--sm-border-subtle)] text-sm">
                {t.system.modules.map((mod) => (
                  <tr key={mod.index}>
                    <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-[var(--sm-text-muted)]">
                      {mod.index}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[var(--sm-text-primary)]">
                      {mod.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-[var(--sm-accent-primary)]">
                      {mod.collection}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[var(--sm-text-secondary)]">
                      {mod.access}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[var(--sm-text-secondary)]">
                      {mod.summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
