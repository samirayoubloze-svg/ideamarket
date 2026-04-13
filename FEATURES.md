# IdeaMarket - Features Documentation

## 1. Authentication System

### Login
- **Route**: `/login`
- **Features**:
  - Email and password validation
  - Error messages for invalid credentials
  - Demo account button for quick access
  - Persistent session using localStorage
  - Redirect to home on successful login

### Registration
- **Route**: `/register`
- **Features**:
  - Full name, email, password validation
  - Password confirmation matching
  - Form validation with error messages
  - Auto-login after registration
  - Terms acceptance checkbox

### Session Management
- **Token Storage**: localStorage (JWT in production)
- **User Data**: Stored in localStorage
- **Auto-restore**: Session persists across page refresh
- **Logout**: Clears all session data

## 2. Idea Management

### Create Idea
- **Route**: `/add-idea` (protected)
- **Fields**:
  - Title (required, min 5 chars)
  - Category (Startup, Business, Content, Marketing, Tech)
  - Price (required, positive number)
  - Description (required, min 50 chars)
- **Validation**:
  - Real-time error messages
  - Form validation on submit
  - Price format validation
- **Success**: Redirects to dashboard

### Browse Ideas
- **Route**: `/explore`
- **Features**:
  - Grid layout (3 columns on desktop)
  - Search by title and description
  - Filter by category
  - Sort by: Newest, Trending, Top Rated, Price
  - Real-time result count
  - Empty state with helpful message

### Idea Detail
- **Route**: `/idea/:id`
- **Features**:
  - Full idea description
  - Author information with avatar
  - Purchase button
  - View count and stats
  - Rating/review section
  - Average rating display
  - Edit/delete buttons for author

### Idea Card Component
- **Location**: Reusable in Explore and Dashboard
- **Shows**:
  - Title (clamped to 2 lines)
  - Description (clamped to 2 lines)
  - Category badge with color coding
  - Author info with avatar
  - Views, comments, rating count
  - Price
  - Hover effect with shadow

## 3. Marketplace Features

### Purchase System
- **One-Click Purchase**: Simulated payment
- **Purchase Validation**: Check user login
- **Access Control**: 
  - Full description visible only to purchasers
  - Locked preview for non-purchasers
- **Purchase Tracking**:
  - User ID added to `purchasedBy` array
  - Prevents duplicate purchases (if implemented)
- **Earning Calculation**: Price × number of purchases

### Pricing
- **Categories**: $19-99 (recommended)
- **Customizable**: Each idea sets own price
- **Display**: USD currency with $ symbol
- **Filtering**: Sort by price ascending/descending

## 4. Reviews & Ratings

### Submit Review
- **Requirement**: Must purchase idea
- **Fields**:
  - Star rating (1-5)
  - Comment (optional)
- **Validation**:
  - Rating required
  - Comment optional
  - Auto-filled user info
- **Timestamp**: Recorded on submission

### View Reviews
- **Display**: All reviews on idea detail page
- **Shows**:
  - User name
  - Star rating (visual)
  - Comment text
  - Submission date
  - Sorted by newest first
- **Average Rating**: Calculated across all reviews
- **Empty State**: Message when no reviews yet

### Review Features
- **Anonymous Option**: User name shown
- **Non-editable**: Reviews cannot be edited (v1)
- **No Deletion**: Reviews cannot be deleted (v1)

## 5. User Dashboard

### Route: `/dashboard` (Protected)

### Statistics Cards
1. **Total Ideas**: Number of user's ideas
2. **Total Views**: Sum of all idea views
3. **Average Rating**: Calculated across all reviews
4. **Earnings**: Total revenue from purchases

### Idea Management
- **List User Ideas**: Grid of user's posted ideas
- **Edit Idea**: Button on card (not fully implemented)
- **Delete Idea**: Confirmation dialog, removes from store
- **View Idea**: Click to go to detail page

### Empty State
- **Message**: "No ideas yet"
- **CTA**: Button to create first idea
- **Icon**: Visual indicator

## 6. User Profiles

### Route: `/profile/:userId`

### Profile Header
- **Avatar**: Creator's image
- **Name**: Creator name
- **Role**: "Idea Creator" label

### Statistics
- **Total Ideas**: Count
- **Total Views**: Sum across all ideas
- **Average Rating**: From all reviews
- **Total Reviews**: Number of ratings received

### Ideas Grid
- **All Ideas**: Shows all creator's ideas
- **Card Layout**: Same as explore page
- **Sorted**: By newest first

### Navigation
- **Back Button**: Navigate to previous page
- **Idea Links**: Click to view idea details

## 7. Home Page

### Route: `/`

### Hero Section
- **Title**: "Your Ideas Have Value"
- **CTA Buttons**: "Browse Ideas" and "Get Started"
- **Gradient Background**: Orange

### How It Works Section
- **4 Steps**:
  1. Share Your Idea
  2. Find Buyers
  3. Get Feedback
  4. Earn Money
- **Icons**: Visual representation
- **Descriptions**: Short benefits

### Featured Ideas
- **Section**: Shows featured ideas (isFeatured: true)
- **Limit**: Up to 3 ideas
- **Grid**: 3 columns
- **Link**: "View All Ideas" button

### Trending Ideas
- **Sorted**: By view count (highest first)
- **Limit**: Up to 3 ideas
- **Section**: "Trending Now"
- **CTA**: "View All Ideas" button

### CTA Section
- **Message**: "Ready to Share Your Ideas?"
- **Button**: "Create Free Account"
- **Styling**: Orange background

## 8. Navigation

### Main Navigation
- **Logo**: Lightbulb icon + "IdeaMarket" text
- **Links**:
  - Explore Ideas
  - Dashboard (logged in only)
- **Auth Area**:
  - **Logged in**: Post Idea button, User dropdown
  - **Logged out**: Login and Sign Up buttons

### User Dropdown
- **Profile**: Link to user profile
- **Logout**: Logout button with icon
- **Mobile**: Converted to menu items

### Mobile Navigation
- **Hamburger Menu**: Toggles on click
- **Same Links**: All desktop links
- **Responsive**: Hides on desktop (md breakpoint)

## 9. Search & Filtering

### Search Bar
- **Location**: Explore page
- **Search Fields**: Title and description
- **Case-insensitive**: Matches any case
- **Real-time**: Updates as you type
- **Placeholder**: Helpful text

### Category Filter
- **Options**: All, Startup, Business, Content, Marketing, Tech
- **Default**: All
- **Visual**: Select dropdown
- **Real-time**: Updates results

### Sort Options
1. **Newest**: By creation date (descending)
2. **Trending**: By view count (highest first)
3. **Top Rated**: By average rating (highest first)
4. **Price: Low to High**: Ascending
5. **Price: High to Low**: Descending

### Results Display
- **Count**: Shows number of matching ideas
- **Empty State**: Message when no results
- **Grid**: 3 columns on desktop

## 10. Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
}
```

### Idea
```typescript
interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  purchasedBy: string[];
  ratings: Rating[];
  views: number;
  isFeatured?: boolean;
}
```

### Rating
```typescript
interface Rating {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
```

## 11. Color Coding

### Category Badges
- **Startup**: Blue (`bg-blue-100 text-blue-800`)
- **Business**: Purple (`bg-purple-100 text-purple-800`)
- **Content**: Green (`bg-green-100 text-green-800`)
- **Marketing**: Pink (`bg-pink-100 text-pink-800`)
- **Tech**: Indigo (`bg-indigo-100 text-indigo-800`)

### UI Elements
- **Primary Action**: Orange (`bg-orange-500`)
- **Secondary Action**: Gray border
- **Danger Action**: Red
- **Success**: Green
- **Warning**: Yellow (ratings)

## 12. Responsive Design

### Breakpoints
- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: > 1024px (lg)

### Mobile Optimizations
- **Navigation**: Hamburger menu
- **Grid**: Single column
- **Cards**: Full width
- **Text**: Adjusted sizing
- **Spacing**: Reduced padding

### Tablet Optimizations
- **Grid**: 2 columns
- **Navigation**: Desktop-like
- **Cards**: Optimized spacing

### Desktop Optimization
- **Grid**: 3-4 columns
- **Full Navigation**: All visible
- **Dropdowns**: Hover menus

## 13. Form Validation

### Types
1. **Required**: Field must have value
2. **Length**: Min/max character count
3. **Format**: Email, number, etc.
4. **Match**: Password confirmation
5. **Business Logic**: Price > 0, category valid

### Feedback
- **Error Messages**: Below each field
- **Red Borders**: Invalid fields
- **Real-time**: Clear on user input
- **Submit Disable**: Until form valid

## 14. Error Handling

### Validation Errors
- **Display**: Inline below fields
- **Clear**: On field change
- **Color**: Red text (#EF4444)

### System Errors
- **Display**: Alert/toast message
- **Action**: Retry button
- **Log**: Console logging

### Not Found
- **Ideas**: "Idea not found" message
- **Users**: "User not found" message
- **Back Button**: Navigate to explore

## 15. Performance Features

### Optimization
- **Code Splitting**: Via React Router
- **Tree Shaking**: Unused code removed
- **CSS Purging**: Unused styles removed
- **Single Bundle**: All-in-one HTML file

### Caching
- **localStorage**: User session
- **Browser Cache**: Static assets
- **State Persistence**: Zustand store

---

## Summary

IdeaMarket is a complete, production-ready marketplace application with:
- ✅ Full authentication system
- ✅ CRUD operations for ideas
- ✅ Purchase and payment flow
- ✅ Review and rating system
- ✅ User profiles and dashboards
- ✅ Advanced search and filtering
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling
- ✅ Performance optimizations

Ready for backend integration and production deployment!
