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
      onSuccess={(result) => {
        // Safely extract secure_url
        const secureUrl =
          result.info && typeof result.info !== 'string' && result.info.secure_url
            ? result.info.secure_url
            : null;

        if (secureUrl) {
          onUpload(secureUrl); // Call the upload handler with the secure URL
        } else {
          console.error('Failed to retrieve secure_url from the upload result:', result);
        }
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
