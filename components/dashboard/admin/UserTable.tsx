import type { User } from "@/types";

interface UserTableProps {
  users?: User[];
  onDelete?: (id: string) => void;
}

const ROLE_STYLES: Record<User["role"], string> = {
  admin:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  user: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
};

export default function UserTable({ users = [], onDelete }: UserTableProps) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <h3 className="font-display font-semibold text-text-light dark:text-text-dark">
          Users
        </h3>
        <button className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover transition-colors">
          + Invite User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs text-subtext-light dark:text-subtext-dark uppercase tracking-wider">
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Joined</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-subtext-light dark:text-subtext-dark"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-text-light dark:text-text-dark">
                          {user.name}
                        </p>
                        <p className="text-xs text-subtext-light dark:text-subtext-dark">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${ROLE_STYLES[user.role]}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-subtext-light dark:text-subtext-dark">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {onDelete && (
                      <button
                        onClick={() => onDelete(user.id)}
                        className="text-xs text-red-500 hover:text-red-600 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
