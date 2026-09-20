import React, { useRef, useEffect } from 'react';
import { Search01, FilterFunnel, X01, Check01 } from 'synthline/react';
import { ToolCategory } from '../types';

interface CategoryTab {
  key: ToolCategory;
  labelEn: string;
  labelFa: string;
}

interface ToolSearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  selectedCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
  filterMenuOpen: boolean;
  onToggleFilterMenu: () => void;
  onClearCategoryFilter: () => void;
  onClearAllFilters: () => void;
  locale: string;
  categoryTabs: CategoryTab[];
}

export function ToolSearchFilter({
  searchQuery,
  onSearchChange,
  onSearchClear,
  selectedCategory,
  onSelectCategory,
  filterMenuOpen,
  onToggleFilterMenu,
  onClearCategoryFilter,
  onClearAllFilters,
  locale,
  categoryTabs,
}: ToolSearchFilterProps) {
  const activeCategoryObj = categoryTabs.find((c) => c.key === selectedCategory);
  const filterAnchorRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!filterMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterAnchorRef.current &&
        !filterAnchorRef.current.contains(e.target as Node)
      ) {
        onToggleFilterMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onToggleFilterMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filterMenuOpen, onToggleFilterMenu]);

  return (
    <div className="drawer-search-filter-section">
      <div className="search-filter-row">
        <div className="search-input-box">
          <Search01
            size={16}
            strokeWidth={2.2}
            color="var(--lemmo-text-muted, #898a8b)"
          />
          <input
            type="text"
            className="search-input-field"
            placeholder={
              locale === 'fa'
                ? 'جستجوی ابزار، مدل یا قابلیت...'
                : 'Search tools, models, pipelines...'
            }
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search tools"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={onSearchClear}
              title={locale === 'fa' ? 'پاک کردن جستجو' : 'Clear search'}
            >
              <X01 size={13} strokeWidth={2.2} color="currentColor" />
            </button>
          )}
        </div>

        {/* Filter Anchor & Popover Dropdown Menu */}
        <div ref={filterAnchorRef} className="filter-button-wrapper">
          <button
            type="button"
            className={`filter-icon-btn ${filterMenuOpen || selectedCategory !== 'all' ? 'active' : ''}`}
            onClick={onToggleFilterMenu}
            title={locale === 'fa' ? 'فیلتر دسته‌بندی' : 'Filter categories'}
            aria-label="Filter categories"
            aria-haspopup="listbox"
            aria-expanded={filterMenuOpen}
          >
            <FilterFunnel size={16} strokeWidth={2.2} color="currentColor" />
            {selectedCategory !== 'all' && <span className="filter-active-dot" />}
          </button>

          {/* Popover Dropdown Menu (does NOT stretch the layout) */}
          {filterMenuOpen && (
            <div
              className="filter-dropdown-popover"
              role="listbox"
              aria-label={locale === 'fa' ? 'فیلتر دسته‌بندی' : 'Filter categories'}
            >
              {categoryTabs.map((tab) => {
                const isSelected = selectedCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={`filter-dropdown-option ${isSelected ? 'selected' : ''}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelectCategory(tab.key);
                    }}
                  >
                    <span>{locale === 'fa' ? tab.labelFa : tab.labelEn}</span>
                    {isSelected && (
                      <Check01
                        size={13}
                        strokeWidth={2.4}
                        className="filter-option-check"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Tags Row with Close action */}
      {(selectedCategory !== 'all' || searchQuery) && (
        <div className="active-filters-row">
          {selectedCategory !== 'all' && activeCategoryObj && (
            <div className="active-filter-chip">
              <span className="filter-chip-text">
                {locale === 'fa'
                  ? activeCategoryObj.labelFa
                  : activeCategoryObj.labelEn}
              </span>
              <button
                type="button"
                className="filter-chip-remove"
                onClick={onClearCategoryFilter}
                title={locale === 'fa' ? 'حذف این فیلتر' : 'Remove filter'}
              >
                <X01 size={12} strokeWidth={2.4} color="currentColor" />
              </button>
            </div>
          )}

          {searchQuery && (
            <div className="active-filter-chip">
              <span className="filter-chip-text">
                {`"${searchQuery}"`}
              </span>
              <button
                type="button"
                className="filter-chip-remove"
                onClick={onSearchClear}
                title={locale === 'fa' ? 'حذف جستجو' : 'Clear search'}
              >
                <X01 size={12} strokeWidth={2.4} color="currentColor" />
              </button>
            </div>
          )}

          <button
            type="button"
            className="clear-all-text-btn"
            onClick={onClearAllFilters}
          >
            {locale === 'fa' ? 'حذف همه' : 'Reset'}
          </button>
        </div>
      )}
    </div>
  );
}
