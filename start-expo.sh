#!/bin/bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 22
echo "Node: $(node --version)"
cd /Users/pradeepgatti/Downloads/Maase-Food-Delivery-App-main
npx expo start --tunnel
