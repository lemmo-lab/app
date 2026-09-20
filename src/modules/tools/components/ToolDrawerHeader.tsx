import React from 'react';

interface ToolDrawerHeaderProps {
  count: number;
  locale: string;
}

export function ToolDrawerHeader({ count, locale }: ToolDrawerHeaderProps) {
  return (
    <div className="drawer-header">
      <div className="drawer-header-title-wrap">
        <h1 className="drawer-header-title">
          {locale === 'fa' ? 'ابزارهای هوش مصنوعی' : 'AI Tools'}
        </h1>
        <span className="drawer-header-badge">
          {locale === 'fa' ? `${count} فعال` : `${count} active`}
        </span>
      </div>
    </div>
  );
}
