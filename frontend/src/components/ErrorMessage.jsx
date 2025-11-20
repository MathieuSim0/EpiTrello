const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-2xl animate-slide-in max-w-md mx-auto">
    <div className="text-6xl mb-4 animate-bounce">⚠️</div>
    <div className="text-red-600 text-xl font-bold mb-2">Oups !</div>
    <div className="text-gray-700 mb-6 text-center">{message}</div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn-danger px-8 py-3 text-lg"
      >
        🔄 Réessayer
      </button>
    )}
  </div>
);

export default ErrorMessage;
