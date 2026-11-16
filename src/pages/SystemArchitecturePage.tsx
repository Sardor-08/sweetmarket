import React, { useState } from 'react';
import { ArchitectureOverview } from '../components/foundation/ArchitectureOverview';
import { DesignSystemShowcase } from '../components/foundation/DesignSystemShowcase';
import { SectionHeader } from '../design-system/ui';
import { useTranslation } from '../hooks/useTranslation';

type SystemTabId = 'tokens' | 'components' | 'architecture';

export function SystemArchitecturePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SystemTabId>('tokens');

  const tabs: { id: SystemTabId; label: string }[] = [
    { id: 'tokens', label: t.system.tabs.tokens },
    { id: 'components', label: t.system.tabs.components },
    { id: 'architecture', label: t.system.tabs.architecture },
  ];

  return (
    <div className="space-y-8 py-8 sm:py-12">
      <SectionHeader
        as="h1"
        title={t.system.heading}
        subtitle={t.system.subheading}
      />

      {/* Interactive Segmented Tab Bar */}
      <div
        role="tablist"
        aria-label={t.system.heading}
        className="inline-flex flex-wrap items-center gap-1 rounded-[10px] border border-[var(--sm-border-subtle)] bg-[var(--sm-bg-subtle)] sm-lens p-1"
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'px-4 py-2 text-xs sm:text-sm font-medium rounded-[7px] whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150',
                'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--sm-focus-ring)]',
                active
                  ? 'bg-[var(--sm-bg-surface)] text-[var(--sm-text-primary)] shadow-xs'
                  : 'text-[var(--sm-text-secondary)] hover:text-[var(--sm-text-primary)]',
              ].join(' ')}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'architecture' ? (
        <ArchitectureOverview />
      ) : (
        <DesignSystemShowcase section={activeTab} />
      )}
    </div>
  );
}
