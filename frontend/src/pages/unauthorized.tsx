export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-red-500 mb-2">Acceso denegado</h1>
      <p className="text-gray-600">No tienes permiso para ver esta página.</p>
    </div>
  );
}
