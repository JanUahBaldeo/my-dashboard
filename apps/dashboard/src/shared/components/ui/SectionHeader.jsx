import { memo } from 'react';
import { FiPlus } from 'react-icons/fi';

const SectionHeader = ({
  title = '',
  description = '',
  buttonText = 'Add',
  onButtonClick,
  showButton = true,
  buttonIcon: ButtonIcon = FiPlus,
  actions,          // optional custom right-side actions (overrides default button)
  children,
  className = '',
}) => {
  const showPrimaryButton = showButton && !actions && buttonText;

  return (
    <header className={`bg-white border-b border-gray-100 px-4 py-4 ${className}`}>
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {title ? <h1 className="text-2xl font-bold text-gray-900">{title}</h1> : null}
          {description ? <p className="mt-0.5 text-sm text-gray-600">{description}</p> : null}
        </div>

        <div className="flex items-center gap-2">
          {actions ? (
            actions
          ) : (
            showPrimaryButton && (
              <button
                type="button"
                onClick={onButtonClick}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#01818E] to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:from-[#01818E]/90 hover:to-cyan-600/90 focus:outline-none focus:ring-2 focus:ring-[#01818E]/30 disabled:opacity-60"
                aria-label={buttonText}
                disabled={!onButtonClick}
              >
                <ButtonIcon className="h-4 w-4" />
                <span>{buttonText}</span>
              </button>
            )
          )}
        </div>
      </div>

      {children ? <div className="mt-2">{children}</div> : null}
    </header>
  );
};

export default memo(SectionHeader);
