'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { TicketList } from '@/components/tickets/TicketList'
import { CreateTicketButton } from '@/components/tickets/CreateTicketButton'
import { ExportTicketsButton } from '@/components/tickets/ExportTicketsButton'
import { useLocalizedStrings } from '@/contexts/LocaleContext'

interface Ticket {
  id: string
  title: string
  description: string
  priority: string
  category: string
  status: string
  createdAt: Date
  user: { id: string; name: string; email: string }
  assignedUser?: { id: string; name: string; email: string }
}

export default function TicketsPage() {
  const { getStrings } = useLocalizedStrings()
  const ticketsStrings = getStrings().tickets
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{ticketsStrings.title}</h1>
              <p className="text-gray-600 mt-2">
                {ticketsStrings.subtitle}
              </p>
            </div>
            <div className="flex gap-2">
              <ExportTicketsButton tickets={filteredTickets} />
              <CreateTicketButton />
            </div>
          </div>
          
          <TicketList onFilteredTicketsChange={setFilteredTickets} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
