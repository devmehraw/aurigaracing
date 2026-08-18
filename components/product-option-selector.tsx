"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"

interface ProductOptionSelectorProps {
  productType: string
  productTypeDetails: any
  onSelectionChange: (selections: Record<string, string>) => void
}

export function ProductOptionSelector({
  productType,
  productTypeDetails,
  onSelectionChange,
}: ProductOptionSelectorProps) {
  const [selections, setSelections] = useState<Record<string, string>>({})

  if (!productTypeDetails || typeof productTypeDetails !== "object") {
    return null
  }

  const handleSelection = (key: string, value: string) => {
    const newSelections = { ...selections, [key]: value }
    setSelections(newSelections)
    onSelectionChange(newSelections)
  }

  const renderOptions = (key: string, values: string) => {
    // Split comma-separated values
    const options = values
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)

    if (options.length === 0) return null

    return (
      <div key={key} className="space-y-3">
        <Label className="text-base font-semibold capitalize">{key.replace(/_/g, " ")}</Label>
        <RadioGroup value={selections[key]} onValueChange={(value) => handleSelection(key, value)}>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <Label
                key={option}
                htmlFor={`${key}-${option}`}
                className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer transition-colors ${
                  selections[key] === option ? "border-primary bg-primary/10" : "border-input hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value={option} id={`${key}-${option}`} className="sr-only" />
                <span>{option}</span>
              </Label>
            ))}
          </div>
        </RadioGroup>
      </div>
    )
  }

  // Render different fields based on product type
  const fieldsToRender: string[] = []

  if (productType === "boot") {
    fieldsToRender.push("sizes", "colors", "shell", "mounting")
  } else if (productType === "frame") {
    fieldsToRender.push("sizes", "colors")
  } else if (productType === "wheel") {
    fieldsToRender.push("sizes", "hardness")
  } else if (productType === "helmet") {
    fieldsToRender.push("sizes")
  } else if (productType === "accessory") {
    fieldsToRender.push("sizes", "colors")
  } else if (productType === "package") {
    fieldsToRender.push("boot_sizes", "colors", "frame_type")
  }

  return (
    <div className="space-y-6 p-6 bg-muted rounded-lg">
      <h3 className="text-lg font-semibold">Select Options</h3>
      {fieldsToRender.map((field) => {
        if (productTypeDetails[field]) {
          return renderOptions(field, productTypeDetails[field])
        }
        return null
      })}

      {Object.keys(selections).length > 0 && (
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-2">Selected Options:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selections).map(([key, value]) => (
              <Badge key={key} variant="secondary">
                {key.replace(/_/g, " ")}: {value}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
