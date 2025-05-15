import { Permission } from './permission.enum';

const permissionLevels: Record<Permission, number> = {
    [Permission.ADMIN]: 4,
    [Permission.MODERATOR]: 3,
    [Permission.USER]: 2,
    [Permission.BANNED]: 1,
};

export function hasPermission(
    currentUserPermission: Permission,
    requiredPermission: Permission,
): boolean {
    const currentUserLevel = permissionLevels[currentUserPermission];
    const requiredLevel = permissionLevels[requiredPermission];

    if (currentUserLevel === undefined || requiredLevel === undefined) {
        // Handle unknown permissions, e.g., by denying access or logging an error
        console.error(`Unknown permission encountered: ${currentUserPermission} or ${requiredPermission}`);
        return false;
    }

    return currentUserLevel >= requiredLevel;
}