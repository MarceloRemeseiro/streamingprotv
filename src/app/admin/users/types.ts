export type User = {
  id: string
  name: string | null
  email: string
  event: {
    id: string
    name: string
  } | null
}

export type SortField = 'name' | 'email'
export type SortOrder = 'asc' | 'desc'

export interface UsersTableProps {
  users: User[]
  totalUsers: number
  currentPage: number
  pageSize: number
  selectedEventId?: string
  sortField: SortField
  sortOrder: SortOrder
  selectedUsers: Set<string>
  onPageChange: (page: number) => void
  onEventFilterChange: (eventId: string) => void
  onSort: (field: SortField) => void
  onUserSelect: (userId: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onDeleteUsers: (userIds: string[]) => void
  events: Array<{ id: string; name: string }>
} 