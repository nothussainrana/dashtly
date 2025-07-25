# Multiple Admin User Setup

This feature automatically ensures that users specified in the `ADMIN_EMAIL_1` through `ADMIN_EMAIL_9` environment variables have the `ADMIN` role in the system. You can configure up to 9 different admin users.

## How it Works

The admin setup functionality works in three ways:

### 1. Application Startup
When the application starts, it checks if users with any of the `ADMIN_EMAIL_1` through `ADMIN_EMAIL_9` exist and don't have the `ADMIN` role. If found, they are automatically updated to have the `ADMIN` role.

### 2. User Registration
When a new user registers with an email that matches any of the `ADMIN_EMAIL_1` through `ADMIN_EMAIL_9`, they are automatically assigned the `ADMIN` role during the registration process.

### 3. Local Development Auto-Creation
When running on localhost (detected via `NEXTAUTH_URL` containing "localhost"), if admin users don't exist and their corresponding `ADMIN_PASSWORD_X` is provided, the system will automatically create new admin users with:
- Email from `ADMIN_EMAIL_X`
- Password from `ADMIN_PASSWORD_X`
- Username generated from email (e.g., `admin@test.com` → `admin`)
- Auto-verified email (no verification needed for localhost)
- `ADMIN` role assigned

## Setup

Add the following environment variables to your `.env` file:

```env
# Admin users (you can use any combination from 1-9)
ADMIN_EMAIL_1=admin@yourcompany.com
ADMIN_EMAIL_2=manager@yourcompany.com
ADMIN_EMAIL_3=support@yourcompany.com

# Passwords for localhost auto-creation (optional)
ADMIN_PASSWORD_1=secure_password_1
ADMIN_PASSWORD_2=secure_password_2
ADMIN_PASSWORD_3=secure_password_3

# Required for localhost detection
NEXTAUTH_URL=http://localhost:3000
```

### Environment Variables

- **`ADMIN_EMAIL_1` to `ADMIN_EMAIL_9`** (Optional): Email addresses for admin users. You can use any combination (e.g., just `ADMIN_EMAIL_1` and `ADMIN_EMAIL_3`)
- **`ADMIN_PASSWORD_1` to `ADMIN_PASSWORD_9`** (Optional): Passwords for auto-creating corresponding admin users in localhost environments
- **`NEXTAUTH_URL`** (Required for Next.js): Used to detect localhost environment

You can configure anywhere from 1 to 9 admin users by setting the corresponding environment variables.

## Examples

### Single Admin User
```env
ADMIN_EMAIL_1=admin@company.com
ADMIN_PASSWORD_1=secure_password
```

### Multiple Admin Users
```env
ADMIN_EMAIL_1=ceo@company.com
ADMIN_EMAIL_2=cto@company.com
ADMIN_EMAIL_3=support@company.com
ADMIN_PASSWORD_1=ceo_password
ADMIN_PASSWORD_2=cto_password
ADMIN_PASSWORD_3=support_password
```

### Production Setup (No Passwords)
```env
ADMIN_EMAIL_1=admin@company.com
ADMIN_EMAIL_2=manager@company.com
# No passwords needed - users register normally
```

## Localhost Detection

The system automatically detects localhost environments by checking if `NEXTAUTH_URL` contains the string "localhost". This works for URLs like:
- `http://localhost:3000`
- `https://localhost:3001`
- `http://localhost:8080`

## Admin Features

All admin users (from any `ADMIN_EMAIL_X`) will receive:
- Full system admin privileges
- Admin role in the database
- Access to admin-only features
- Certified badges and other admin perks
- All premium features enabled

## Important Notes

- **Case-insensitive**: Email comparisons are case-insensitive, so `Admin@Company.com` will match `admin@company.com`
- **Flexible numbering**: You don't need consecutive numbers - `ADMIN_EMAIL_1` and `ADMIN_EMAIL_5` will both work
- **Optional**: If no `ADMIN_EMAIL_X` variables are set, the system will skip admin setup
- **Safe**: The setup runs only once per application startup with error handling
- **Automatic**: No manual intervention required - just set environment variables and restart
- **Localhost Only**: Auto-creation only happens when `NEXTAUTH_URL` contains "localhost"
- **Password Required**: For auto-creation, both `ADMIN_EMAIL_X` and `ADMIN_PASSWORD_X` must be set

## Logs

The system provides informative logs during the admin setup process:

- `[ADMIN_SETUP] No ADMIN_EMAIL_X environment variables set` - When no admin emails are configured
- `[ADMIN_SETUP] Checking admin user setup for X admin email(s)` - Startup message showing count
- `[ADMIN_SETUP] ✅ Admin user X (email) already has ADMIN role` - When user is already an admin
- `[ADMIN_SETUP] ✅ Successfully assigned ADMIN role to user X: email` - When admin role is assigned
- `[ADMIN_SETUP] ✅ Created new admin user for localhost: email` - When admin user is auto-created
- `[ADMIN_SETUP] 🚀 Localhost environment detected - creating admin user X automatically` - When starting auto-creation
- `[ADMIN_SETUP] ⚠️ Localhost detected but ADMIN_PASSWORD_X not set` - When localhost but no password provided
- `[ADMIN_SETUP] ✅ Created new admin user during registration: email` - When admin registers normally

## Usage Examples

### For Production (Multiple Admins)
```env
ADMIN_EMAIL_1=ceo@mycompany.com
ADMIN_EMAIL_2=admin@mycompany.com
ADMIN_EMAIL_3=support@mycompany.com
# No passwords needed - users register normally
```

### For Local Development (Auto-Create All)
```env
ADMIN_EMAIL_1=admin1@localhost.com
ADMIN_EMAIL_2=admin2@localhost.com
ADMIN_EMAIL_3=admin3@localhost.com
ADMIN_PASSWORD_1=dev123password
ADMIN_PASSWORD_2=dev456password
ADMIN_PASSWORD_3=dev789password
NEXTAUTH_URL=http://localhost:3000
```

When you start the app locally, it will automatically create all 3 admin users if they don't exist.

### Mixed Setup (Some Auto-Create, Some Manual)
```env
ADMIN_EMAIL_1=auto@localhost.com
ADMIN_EMAIL_2=manual@localhost.com
ADMIN_PASSWORD_1=password123
# ADMIN_PASSWORD_2 not set - user will need to register manually
NEXTAUTH_URL=http://localhost:3000
```

## Security Considerations

- Make sure your `ADMIN_EMAIL_X` addresses are set to secure, controlled email addresses
- Admin users will have full system privileges, so choose emails carefully
- Consider using dedicated admin email addresses rather than personal ones
- **`ADMIN_PASSWORD_X` should be strong and secure, even for local development**
- Auto-creation only works on localhost - production environments require manual registration
- Each admin user operates independently with full admin privileges 