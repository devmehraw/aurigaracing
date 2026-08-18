# Testing Checklist for Auriga Racing E-commerce

## Authentication Flow
- [ ] Sign up creates new user account
- [ ] Email verification works
- [ ] Login redirects to account page
- [ ] Logged-in users cannot access /auth/login or /auth/signup
- [ ] Logout works and redirects to homepage
- [ ] Navbar shows dropdown when logged in

## Customer Features
- [ ] Account sidebar navigation works
- [ ] Profile editing (name, phone, password)
- [ ] Order history displays correctly
- [ ] Address management (add, edit, delete, set default)
- [ ] Create support ticket
- [ ] View ticket detail
- [ ] Reply to ticket
- [ ] See staff responses

## Admin - User Management
- [ ] View all users with phone numbers
- [ ] Change user password
- [ ] Delete user account

## Admin - Product Management  
- [ ] Access /admin/products/new
- [ ] Create new product with ImageKit upload
- [ ] Access /admin/products/[id]/edit
- [ ] Edit existing product
- [ ] View product from admin panel
- [ ] Products display in catalog

## Admin - Category Management
- [ ] Create main category
- [ ] Create subcategory with parent selection
- [ ] Edit category
- [ ] Delete category
- [ ] Categories display hierarchically
- [ ] Upload category image via ImageKit

## Admin - Ticket Management
- [ ] View all tickets list
- [ ] Click "View" button opens ticket detail
- [ ] Reply to customer ticket
- [ ] Change ticket status via dropdown
- [ ] Staff replies show with badge
- [ ] Customer sees staff responses

## Category Pages
- [ ] /products/category/inline-speed-skating
- [ ] /products/category/inline-skate-packages
- [ ] /products/category/inline-boots
- [ ] /products/category/inline-frames
- [ ] /products/category/inline-wheels
- [ ] /products/category/inline-bearings
- [ ] /products/category/inline-accessories
- [ ] /products/category/helmets-skate-bags
- [ ] /products/category/ice-speed-skating
- [ ] /products/category/ice-skate-packages
- [ ] /products/category/ice-boots
- [ ] /products/category/ice-blades
- [ ] /products/category/clap-skates
- [ ] /products/category/ice-helmets
- [ ] /products/category/ice-accessories
- [ ] /products/category/cycling-triathlon
- [ ] /products/category/fashion-apparel

## Shopping Flow
- [ ] Browse products
- [ ] Filter products
- [ ] Search products
- [ ] Add to cart
- [ ] Update cart quantities
- [ ] Remove from cart
- [ ] Checkout process
- [ ] Stripe payment
- [ ] Order confirmation

## Legal Pages
- [ ] Privacy Policy accessible
- [ ] Terms & Conditions accessible
- [ ] Warranty & Shipping accessible
- [ ] Disclaimer accessible
- [ ] Distributors accessible
- [ ] Dealer Application accessible
- [ ] FAQs accessible

## ImageKit.io
- [ ] Product images upload via ImageKit
- [ ] Category images upload via ImageKit
- [ ] Images display with optimization
- [ ] Image transformations work
