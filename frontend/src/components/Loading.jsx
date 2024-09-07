import { ClipLoader } from 'react-spinners';

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <svg
        className="animate-spin h-12 w-12 text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 016-7.75V2a10 10 0 10-2 0v2.25A8 8 0 014 12z"
        />
      </svg>
    </div>
  );
}

export default Loading;
