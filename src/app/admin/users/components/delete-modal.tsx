import { User } from '../types'

interface DeleteModalProps {
  users: User[]
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteModal({ users, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white ml-4">
            Confirmar eliminación
          </h3>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            {users.length === 1
              ? '¿Estás seguro de que quieres eliminar este usuario?'
              : `¿Estás seguro de que quieres eliminar ${users.length} usuarios?`}
          </p>
          {users.length === 1 ? (
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-white font-medium">{users[0].name || 'Sin nombre'}</p>
              <p className="text-gray-400 text-sm">{users[0].email}</p>
              <p className="text-gray-400 text-sm">
                Evento: {users[0].event?.name || 'Sin evento'}
              </p>
            </div>
          ) : (
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-red-400 text-sm mb-2">
                Esta acción eliminará los siguientes usuarios:
              </p>
              <ul className="text-gray-300 text-sm max-h-32 overflow-y-auto">
                {users.map(user => (
                  <li key={user.id} className="mb-1">
                    {user.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-4 text-red-400 text-sm">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
} 