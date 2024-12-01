import { Spinner } from './Spinner';

interface ButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  labelLoading?: string;
  labelReady: string;
  className?: string
}

export const Button = ({
  onClick,
  loading = false,
  disabled = false,
  labelLoading = '',
  labelReady,
  className
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className ?? 'w-full h-10 px-4 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors'}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{labelLoading}</span>
        </>
      ) : (
        labelReady
      )}
    </button>
  );
};
