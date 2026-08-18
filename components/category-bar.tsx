"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

interface CategoryWithSubs extends Category {
  subcategories: Category[]
}

export function CategoryBar() {
  const [categories, setCategories] = useState<CategoryWithSubs[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient()

      const { data: parentCategories } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .is("parent_id", null)
        .order("name")

      if (parentCategories) {
        const categoriesWithSubs = await Promise.all(
          parentCategories.map(async (parent) => {
            const { data: subs } = await supabase
              .from("categories")
              .select("*")
              .eq("parent_id", parent.id)
              .eq("is_active", true)
              .order("name")

            return {
              ...parent,
              subcategories: subs || [],
            }
          }),
        )

        const categoryOrder = ["Inline Speed Skating", "Ice Speed Skating", "Cycling & Triathlon", "Fashion & Apparel"]

        const sortedCategories = categoriesWithSubs.sort((a, b) => {
          const indexA = categoryOrder.indexOf(a.name)
          const indexB = categoryOrder.indexOf(b.name)

          if (indexA === -1 && indexB === -1) return 0
          if (indexA === -1) return 1
          if (indexB === -1) return -1
          return indexA - indexB
        })

        setCategories(sortedCategories)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4">
        <NavigationMenu className="max-w-full justify-start">
          <NavigationMenuList className="flex-wrap gap-2">
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className="inline-flex h-10 items-center px-4 py-2 text-sm font-medium hover:text-[#bd9131] transition-colors">
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {categories.map((category) => (
              <NavigationMenuItem key={category.id}>
                {category.subcategories.length > 0 ? (
                  <>
                    <NavigationMenuTrigger className="h-10 hover:text-[#bd9131]">{category.name}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                        <li>
                          <Link href={`/products/category/${category.slug}`} legacyBehavior passHref>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">View All {category.name}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Browse all products in this category
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        {category.subcategories.map((sub) => (
                          <li key={sub.id}>
                            <Link href={`/products/category/${sub.slug}`} legacyBehavior passHref>
                              <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">{sub.name}</div>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link href={`/products/category/${category.slug}`} legacyBehavior passHref>
                    <NavigationMenuLink className="inline-flex h-10 items-center px-4 py-2 text-sm font-medium hover:text-[#bd9131] transition-colors">
                      {category.name}
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}
