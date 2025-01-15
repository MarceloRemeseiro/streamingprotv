'use client'

import { useState, useEffect } from 'react'
import { prisma } from '@/lib/prisma'
import { UsersTable } from './components/users-table'
import { User, SortField, SortOrder } from './types'

const PAGE_SIZE = 50

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEventId, setSelectedEventId] = useState<string>()
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [events, setEvents] = useState<Array<{ id: string; name: string }>>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar usuarios
  useEffect(() => {
    loadUsers()
    loadEvents()
  }, [currentPage, selectedEventId, sortField, sortOrder])

  async function loadUsers() {
    try {
      const searchParams = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: PAGE_SIZE.toString(),
        sortField,
        sortOrder,
        ...(selectedEventId && { eventId: selectedEventId }),
      })

      const response = await fetch(`/api/users?${searchParams}`)
      const data = await response.json()
      
      setUsers(data.users)
      setTotalUsers(data.total)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function loadEvents() {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error loading events:', error)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEventFilterChange = (eventId: string) => {
    setSelectedEventId(eventId)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  const handleUserSelect = (userId: string, selected: boolean) => {
    const newSelected = new Set(selectedUsers)
    if (selected) {
      newSelected.add(userId)
    } else {
      newSelected.delete(userId)
    }
    setSelectedUsers(newSelected)
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = users.map(user => user.id)
      setSelectedUsers(new Set(allIds))
    } else {
      setSelectedUsers(new Set())
    }
  }

  const handleDeleteUsers = async (userIds: string[]) => {
    try {
      await fetch('/api/users/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds }),
      })

      // Actualizar la UI
      setSelectedUsers(new Set())
      loadUsers()
    } catch (error) {
      console.error('Error deleting users:', error)
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <UsersTable
        users={users}
        totalUsers={totalUsers}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        selectedEventId={selectedEventId}
        sortField={sortField}
        sortOrder={sortOrder}
        selectedUsers={selectedUsers}
        onPageChange={handlePageChange}
        onEventFilterChange={handleEventFilterChange}
        onSort={handleSort}
        onUserSelect={handleUserSelect}
        onSelectAll={handleSelectAll}
        onDeleteUsers={handleDeleteUsers}
        events={events}
      />
    </div>
  )
} 