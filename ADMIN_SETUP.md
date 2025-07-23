# Admin User Setup

This feature automatically ensures that the user specified in the `ADMIN_EMAIL` environment variable has the `ADMIN` role in the system.

## How it Works

The admin setup functionality works in two ways:

### 1. Application Startup
When the application starts, it checks if a user with the `ADMIN_EMAIL` exists and doesn't have the `ADMIN` role. If found, the user is automatically updated to have the `ADMIN` role.

### 2. User Registration
When a new user registers with an email that matches the `ADMIN_EMAIL`, they are automatically assigned the `ADMIN` role during the registration process.

## Setup

Add the following environment variable to your `.env` file:

```env
ADMIN_EMAIL=admin@yourcompany.com
```

Replace `admin@yourcompany.com` with the email address you want to designate as the admin user.

## Important Notes

- **Case-insensitive**: The email comparison is case-insensitive, so `Admin@Company.com` will match `admin@company.com`.
- **Optional**: If `ADMIN_EMAIL` is not set, the system will skip admin setup and log a message.
- **Safe**: The setup runs only once per application startup and includes error handling to prevent application failures.
- **Automatic**: No manual intervention required - just set the environment variable and restart the application.

## Logs

The system provides informative logs during the admin setup process:

- `[ADMIN_SETUP] ADMIN_EMAIL environment variable not set` - When no admin email is configured
- `[ADMIN_SETUP] User {email} not found` - When the admin user doesn't exist yet
- `[ADMIN_SETUP] User {email} already has ADMIN role` - When the user is already an admin
- `[ADMIN_SETUP] Successfully assigned ADMIN role to user: {email}` - When admin role is assigned
- `[ADMIN_SETUP] Created new admin user during registration: {email}` - When admin user registers

## Security Considerations

- Make sure your `ADMIN_EMAIL` is set to a secure, controlled email address
- The admin user will have full system privileges, so choose the email carefully
- Consider using a dedicated admin email address rather than a personal one 