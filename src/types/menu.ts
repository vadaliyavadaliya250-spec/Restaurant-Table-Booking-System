export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  subcategory?: string
  image: string
  tags: string[]
  available: boolean
  featured?: boolean
  spicy?: boolean
  vegetarian?: boolean
  glutenFree?: boolean
  prepTime?: string
  calories?: number
}

export interface MenuCategory {
  id: string
  name: string
  description: string
  icon: string
  items: MenuItem[]
}

export interface HotelInfo {
  name: string
  tagline: string
  address: string
  phone: string
  email: string
  logo?: string
  primaryColor: string
  accentColor: string
}

export interface MenuData {
  hotel: HotelInfo
  categories: MenuCategory[]
  lastUpdated: string
}
