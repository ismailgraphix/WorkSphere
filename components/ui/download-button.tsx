import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"

interface DownloadButtonProps {
  leaveId: string
  variant?: "outline" | "default"
  size?: "sm" | "default"
}

export function DownloadButton({ leaveId, variant = "outline", size = "sm" }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      const response = await fetch(`/api/leave/pdf/${leaveId}`)
      
      if (!response.ok) {
        throw new Error('Failed to download PDF')
      }

      // Create blob from response
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      // Create temporary link and trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = `leave_notification_${leaveId}.pdf`
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      Download PDF
    </Button>
  )
} 