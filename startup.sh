#!/bin/bash
source ./export.bash
echo "Welcome Frogula! Starting the app..."

# Get local IP address
api_url=$(ipconfig getifaddr en0)

# Ensure .env exists
touch .env

# Update API_URL if it exists, otherwise append it
if grep -q "^API_URL=" .env; then
  sed -i '' "s|^API_URL=.*|API_URL=http://$api_url:8080|" .env
else
  echo "API_URL=http://$api_url:8080" >> .env
fi

echo "Updated API_URL to http://$api_url:8080"

echo "Starting Expo."
npx expo start