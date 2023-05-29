import {
    Ability,
    AbilityBuilder,
    createMongoAbility,
    ExtractSubjectType,
    InferSubjects,
    MongoAbility,
} from '@casl/ability';
import { User } from '../../user/entities/user.entity';

/**
 * Đây là một ví dụ về việc sử dụng enum Action trong Casl Ability.
 * Enum này định nghĩa các hành động (actions) mà người dùng có thể thực hiện trong hệ thống.
 *
 * Ví dụ:
 * - Manage: Quản lý, có quyền thực hiện tất cả các hành động trên đối tượng.
 * - List: Liệt kê, có quyền xem danh sách đối tượng.
 * - Create: Tạo mới, có quyền tạo đối tượng mới.
 * - Read: Đọc, có quyền xem chi tiết một đối tượng.
 * - Update: Cập nhật, có quyền cập nhật thông tin của một đối tượng.
 * - Delete: Xóa, có quyền xóa một đối tượng.
 */
export enum Action {
    Manage = 'manage',
    List = 'list',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}
type Subjects = InferSubjects<typeof User | 'all'>;
export type AppAbility = MongoAbility<[Action, Subjects]>;

export class CaslAbilityFactory {
    createForUser(user: User & { permissions: string[] }) {
        const { can: allow, cannot: deny, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
        const userPermissions = user.permissions;

        allow(Action.Read, 'all');

        // Nếu người dùng có quyền hạn 'super-admin' thì có thể thực hiện tất cả các hành động trên tất cả các đối tượng.
        if (userPermissions.includes('super-admin')) {
            allow(Action.Manage, 'all');
        }
        // Các quyền hạn của người dùng với đối tượng User
        if (userPermissions.includes('user.manage')) {
            allow(Action.Manage, User);
        }
        if (userPermissions.includes('user.list')) {
            allow(Action.List, User);
        }
        if (userPermissions.includes('user.create')) {
            allow(Action.Create, User);
        }
        if (userPermissions.includes('user.update')) {
            allow(Action.Update, User);
        }
        if (userPermissions.includes('user.delete')) {
            allow(Action.Delete, User);
        }

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
