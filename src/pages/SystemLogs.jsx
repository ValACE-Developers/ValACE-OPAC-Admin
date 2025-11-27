export const SystemLogs = () => {
  return (
    <div className="w-full h-screen">
      <iframe
        src={import.meta.env.VITE_SYSTEM_LOGS_URL}
        className="w-full h-full border-0"
        title="System Logs"
      />
    </div>
  );
};
