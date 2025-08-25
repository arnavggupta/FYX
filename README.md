## Setup Instructions

1. **Create the project:**
   ```bash
   npx create-next-app@latest weather
   cd weather
   ```

2. **Install dependencies:**
   ```bash
   npm install axios sqlite3 lucide-react
   npm install -D @types/node
   ```

3. **Get OpenWeatherMap API Key:**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key

4. **Create environment file (.env.local):**
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   REDIS_URL=your_redis_uri
   ```

5. **Replace the default files with the code above**

6. **Run the development server:**
   ```bash
   npm run dev
   ```

## Key Features Implemented:

 **Current weather display** - Temperature, conditions, humidity, wind speed
 **5-day forecast** - Daily min/max temperatures and conditions  
 **Add/remove cities** - Search and manage multiple cities
 **Data caching** - 10-minute cache to minimize API calls
 **Responsive design** - Works on desktop and mobile
 **Error handling** - Graceful error handling throughout
 **Real-time updates** - Refresh functionality
 **Redis database** - Stores user preferences and cache
 **RESTful API** - Clean API endpoints
 **TypeScript** - Full type safety

The app will be available at `http://localhost:3000` 
