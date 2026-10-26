import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClick?: () => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  badge,
  badgeColor = 'bg-blue-50 text-blue-700 border-blue-200',
  icon,
  action,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col justify-between ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {(title || icon || action || badge) && (
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-semibold text-slate-900 tracking-tight text-base">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {badge && (
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                {badge}
              </span>
            )}
            {action && <div>{action}</div>}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
};
