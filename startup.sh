#!/bin/bash
echo "Welcome Frogula! Starting the app..."
unset EXPO_PUBLIC_API_URL
# Get local IP address
api_url=$(ipconfig getifaddr en0)

# Ensure .env exists
touch .env

# Update API_URL if it exists, otherwise append it
if grep -q "^EXPO_PUBLIC_API_URL=" .env; then
  sed -i '' "s|^EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=http://$api_url:8080|" .env
else
  echo "EXPO_PUBLIC_API_URL=http://$api_url:8080" >> .env
fi

echo "Updated EXPO_PUBLIC_API_URL to http://$api_url:8080"

echo "Starting Expo."
npx expo start --clear