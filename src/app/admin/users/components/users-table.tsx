'use client'

import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import { UsersTableProps, SortField, User } from '../types'
import { DeleteModal } from './delete-modal'

export function UsersTable({
  users,
  totalUsers,
  currentPage,
  pageSize,
  selectedEventId,
  sortField,
  sortOrder,
  selectedUsers,
  onPageChange,
  onEventFilterChange,
  onSort,
  onUserSelect,
  onSelectAll,
  onDeleteUsers,
  events
}: UsersTableProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [usersToDelete, setUsersToDelete] = useState<User[]>([])

  const handleSort = (field: SortField) => {
    onSort(field)
  }

  const handleDeleteSelected = () => {
    setUsersToDelete(users.filter(user => selectedUsers.has(user.id)))
    setShowDeleteConfirm(true)
  }

  const totalPages = Math.ceil(totalUsers / pageSize)

  return (
    <div>
      {/* Filtros y acciones */}
      <div className="mb-4 flex justify-between items-center">
        <select
          value={selectedEventId || ''}
          onChange={(e) => onEventFilterChange(e.target.value)}
          className="rounded-md border-gray-600 bg-gray-700 text-white p-2"
        >
          <option value="">Todos los eventos</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        {selectedUsers.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
          >
            Eliminar seleccionados ({selectedUsers.size})
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 py-3.5 w-4">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === users.length}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-700 text-indigo-600"
                  />
                </div>
              </th>
              <th 
                className="px-3 py-3.5 text-left text-sm font-semibold text-white cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Nombre
                  {sortField === 'name' && (
                    sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-3 py-3.5 text-left text-sm font-semibold text-white cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {sortField === 'email' && (
                    sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                Evento
              </th>
              <th className="px-3 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-3 py-4 w-4">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={(e) => onUserSelect(user.id, e.target.checked)}
                      className="rounded border-gray-600 bg-gray-700 text-indigo-600"
                    />
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                  {user.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                  {user.event?.name || '-'}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                  <button
                    onClick={() => onDeleteUsers([user.id])}
                    className="text-red-400 hover:text-red-300"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Mostrando {(currentPage - 1) * pageSize + 1} a {Math.min(currentPage * pageSize, totalUsers)} de {totalUsers} usuarios
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-700 text-white disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-700 text-white disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showDeleteConfirm && (
        <DeleteModal
          users={usersToDelete}
          onConfirm={() => {
            onDeleteUsers(usersToDelete.map(u => u.id))
            setShowDeleteConfirm(false)
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  )
} 