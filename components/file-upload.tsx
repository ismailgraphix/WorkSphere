'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { CloudUpload } from 'lucide-react'

interface FileUploadProps {
  onUpload: (url: string) => void
  label: string
}

export function FileUpload({ onUpload, label }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)

  return (
    <CldUploadWidget
      uploadPreset="fusejogp"
      onUpload={(result: any) => {
        setUploading(false)
        if (result.event === 'success') {
          onUpload(result.info.secure_url)
        }
      }}
      onClose={() => setUploading(false)}
    >
      {({ open }) => (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setUploading(true)
            open()
          }}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : (
            <>
              <CloudUpload className="mr-2 h-4 w-4" />
              {label}
            </>
          )}
        </Button>
      )}
    </CldUploadWidget>
  )
}