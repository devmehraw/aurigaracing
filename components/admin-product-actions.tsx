"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, Eye } from "lucide-react"

export function AdminProductActions({ productId, slug }: { productId: string; slug: string }) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href={`/admin/products/${productId}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild size="sm" variant="outline">
        <Link href={`/admin/products/${productId}/edit`}>
          <Edit className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
