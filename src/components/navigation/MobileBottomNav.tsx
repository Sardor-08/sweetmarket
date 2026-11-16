import React from 'react';
import { CakeSlice, ChefHat, Heart, Home, UserRound } from 'lucide-react';
import { AppRouteId } from '../../app/routes';
import { useTranslation } from '../../hooks/useTranslation';

export interface MobileBottomNavProps {
  activeRoute: AppRouteId;
  onNavigate: (route: AppRouteId) => void;
}

export function MobileBottomNav({ activeRoute, onNavigate }: MobileBottomNavProps) {
  const { t } = useTranslation();

  const items: { id: AppRouteId; label: string; icon: React.ReactNode }[] = [
    { id: 'marketplace', label: t.nav.marketplace, icon: <Home className="w-4 h-4" /> },
    { id: 'catalog', label: t.nav.catalog, icon: <CakeSlice className="w-4 h-4" /> },
    { id: 'artisans', label: t.nav.artisans, icon: <ChefHat className="w-4 h-4" /> },
    { id: 'favorites', label: t.nav.favorites, icon: <Heart className="w-4 h-4" /> },
    { id: 'profile', label: t.nav.profile, icon: <UserRound className="w-4 h-4" /> },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-3 inset-x-3 z-30 md:hidden mx-auto max-w-md rounded-full border border-[var(--sm-border-strong)] bg-[var(--sm-bg-surface)] sm-lens p-1.5"
    >
      <div className="grid grid-cols-5 items-center gap-1">
        {items.map((item) => {
          const active = activeRoute === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={active ? 'page' : undefined}
              className={[
                'flex flex-col items-center justify-center gap-0.5 rounded-full py-1.5 px-1 text-[10px] font-semibold whitespace-nowrap cursor-pointer transition-all duration-200',
                active
                  ? 'bg-[var(--sm-bg-elevated)] border border-[var(--sm-border-strong)] text-[var(--sm-accent-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]'
                  : 'border border-transparent text-[var(--sm-text-muted)] hover:text-[var(--sm-text-primary)]',
              ].join(' ')}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span className="truncate max-w-[60px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
