import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface TicketForExport {
  id: string
  title: string
  description: string
  priority: string
  category: string
  status: string
  user: { name: string }
  assignedUser?: { name: string } | null
  createdAt: Date | string
}

function escapeCSVField(field: string | number | undefined): string {
  if (field === undefined || field === null) return ''
  
  const fieldStr = String(field)
  if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
    return `"${fieldStr.replace(/"/g, '""')}"` 
  }
  return fieldStr
}

export function exportTicketsToCSV(tickets: TicketForExport[]): void {
  const headers = ['ID', 'Title', 'Description', 'Priority', 'Category', 'Status', 'Created By', 'Assigned To', 'Created At']
  
  const rows = tickets.map(ticket => [
    ticket.id,
    ticket.title,
    ticket.description,
    ticket.priority,
    ticket.category,
    ticket.status,
    ticket.user.name,
    ticket.assignedUser?.name || 'Unassigned',
    new Date(ticket.createdAt).toISOString()
  ])
  
  const csvContent = [
    headers.map(escapeCSVField).join(','),
    ...rows.map(row => row.map(escapeCSVField).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  const now = new Date()
  const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '')
  const filename = `tickets-${timestamp}.csv`
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
