'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { CloudUpload } from 'lucide-react'

interface FileUploadProps {
  onUpload: (url: string) => void
  label: string
}

export function FileUpload({ onUpload, label }: FileUploadProps) {
  return (
    <CldUploadWidget
      uploadPreset="fusejogp"
      onSuccess={(result: any) => {
        onUpload(result.info.secure_url)
      }}
    >
      {({ open }) => {
        return (
          <Button
            type="button"
            variant="outline"
            onClick={() => open?.()}
          >
            <CloudUpload className="mr-2 h-4 w-4" />
            {label}
          </Button>
        )
      }}
    </CldUploadWidget>
  )
}