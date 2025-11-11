'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import { useLocalizedStrings } from '@/contexts/LocaleContext'
import { exportTicketsToCSV } from '@/lib/utils'
import { toast } from 'sonner'

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

interface ExportTicketsButtonProps {
  tickets: Ticket[]
}

export function ExportTicketsButton({ tickets }: ExportTicketsButtonProps) {
  const { getStrings } = useLocalizedStrings()
  const strings = getStrings()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (tickets.length === 0) {
      toast.error(strings.tickets.noTicketsToExport)
      return
    }

    try {
      setIsExporting(true)
      exportTicketsToCSV(tickets)
      toast.success(strings.tickets.exportSuccess)
    } catch (error) {
      console.error('Export failed:', error)
      toast.error(strings.tickets.exportError)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button 
      onClick={handleExport}
      disabled={tickets.length === 0 || isExporting}
      variant="outline"
    >
      <DownloadIcon className="mr-2 h-4 w-4" />
      {strings.tickets.exportTickets}
    </Button>
  )
}

