#!/bin/bash

# PharmaGuard Security Fix Script
# This script addresses critical security vulnerabilities

echo "🔒 PharmaGuard Security Fix Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "⚠️  WARNING: This script will make significant changes to your project."
echo "Please ensure you have committed all changes before proceeding."
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "📦 Step 1: Updating vulnerable npm packages..."
npm update react-router-dom@latest
npm update vite@latest
npm update lodash@latest
npm update js-yaml@latest
npm update glob@latest
npm update ajv@latest
npm update esbuild@latest
npm audit fix

echo ""
echo "🔐 Step 2: Securing environment files..."

# Create .env.example if it doesn't exist
if [ ! -f ".env.example" ]; then
    cat > .env.example << 'EOF'
# Supabase Configuration (DO NOT COMMIT REAL VALUES)
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
EOF
    echo "✅ Created .env.example"
fi

# Update .gitignore
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# Environment variables" >> .gitignore
    echo ".env" >> .gitignore
    echo "backend/.env" >> .gitignore
    echo "✅ Updated .gitignore"
fi

echo ""
echo "🔐 Step 3: Creating backend .env.example..."
if [ ! -f "backend/.env.example" ]; then
    cat > backend/.env.example << 'EOF'
# Database Configuration
DATABASE_URL=sqlite+aiosqlite:///./pharmaguard.db

# CORS Configuration
CORS_ORIGINS=["http://localhost:5173","http://localhost:8080"]

# Security (Add these in production)
# SECRET_KEY=your-secret-key-here
# JWT_SECRET=your-jwt-secret-here
# JWT_ALGORITHM=HS256
# ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF
    echo "✅ Created backend/.env.example"
fi

echo ""
echo "⚠️  Step 4: Security warnings..."
echo ""
echo "🔴 CRITICAL: You MUST do the following manually:"
echo ""
echo "1. ROTATE YOUR SUPABASE API KEYS:"
echo "   - Go to https://app.supabase.com/project/ewhntptpsfqwuetrgyxy/settings/api"
echo "   - Generate new keys"
echo "   - Update your .env file with new keys"
echo ""
echo "2. REMOVE .env FROM GIT HISTORY:"
echo "   Run: git filter-branch --force --index-filter \"git rm --cached --ignore-unmatch .env backend/.env\" --prune-empty --tag-name-filter cat -- --all"
echo "   Then: git push origin --force --all"
echo ""
echo "3. ADD AUTHENTICATION to your API endpoints"
echo "   See SECURITY_AUDIT_REPORT.md for implementation details"
echo ""
echo "4. IMPLEMENT RATE LIMITING"
echo "   Install: pip install slowapi"
echo "   See SECURITY_AUDIT_REPORT.md for configuration"
echo ""

echo ""
echo "📋 Step 5: Installing security packages..."
cd backend
pip install slowapi bleach python-jose[cryptography] passlib[bcrypt] --quiet
cd ..

echo ""
echo "✅ Security fixes applied!"
echo ""
echo "📄 Next steps:"
echo "1. Review SECURITY_AUDIT_REPORT.md for detailed information"
echo "2. Implement authentication (see report)"
echo "3. Add rate limiting (see report)"
echo "4. Test your application thoroughly"
echo "5. Consider hiring a security professional for a full audit"
echo ""
echo "🔒 Stay secure!"
