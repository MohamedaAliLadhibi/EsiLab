"use client";

import { useEffect, useState } from "react";
import { Check, Trash2, UserCheck, UserX } from "lucide-react";
import {
  approveSignup,
  deleteUser,
  getPendingSignups,
  getUsers,
  rejectSignup,
  updateUser, // <-- new import
} from "@/lib/api";
import {
  Badge,
  Btn,
  Card,
  Empty,
  PageHeader,
  Spinner,
  Table,
  Td,
  Th,
} from "@/components/ui";
import { useAuth } from "@/components/auth/AuthProvider";

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for the edit modal
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "employer",
    status: "approved",
    password: "",
  });

  async function load() {
    setError("");
    const [usersResponse, pendingResponse] = await Promise.all([
      getUsers(),
      getPendingSignups(),
    ]);
    setUsers(usersResponse.data || []);
    setPending(pendingResponse.data || []);
  }

  useEffect(() => {
    load()
      .catch((err) => setError(err.message || "Could not load users"))
      .finally(() => setLoading(false));
  }, []);
async function approve(id: number) {
  await approveSignup(id);
  await load();
  window.dispatchEvent(new CustomEvent('pending-count-updated'));
}

async function reject(id: number) {
  await rejectSignup(id);
  await load();
  window.dispatchEvent(new CustomEvent('pending-count-updated'));
}

async function remove(id: number) {
  if (!confirm('Delete this user?')) return;
  await deleteUser(id);
  await load();
  window.dispatchEvent(new CustomEvent('pending-count-updated'));
}
  // --- Edit functions ---
  function startEdit(user: any) {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "employer",
      status: user.status || "approved",
      password: "",
    });
  }

  function cancelEdit() {
    setEditingUser(null);
    setEditForm({
      name: "",
      email: "",
      role: "employer",
      status: "approved",
      password: "",
    });
  }

  async function saveEdit() {
    if (!editingUser) return;
    // Build payload – only include changed fields
    const payload: any = {};
    if (editForm.name !== editingUser.name) payload.name = editForm.name;
    if (editForm.email !== editingUser.email) payload.email = editForm.email;
    if (editForm.role !== editingUser.role) payload.role = editForm.role;
    if (editForm.status !== editingUser.status)
      payload.status = editForm.status;
    if (editForm.password && editForm.password.length > 0)
      payload.password = editForm.password;

    if (Object.keys(payload).length === 0) {
      cancelEdit();
      return;
    }

    try {
      await updateUser(editingUser.id, payload);
      await load();
      cancelEdit();
    } catch (err) {
      alert("Failed to update user: " + (err as Error).message);
    }
  }

  if (user?.role !== "admin") {
    return (
      <div className="p-8">
        <Empty
          message="Only admins can manage users."
          icon={<UserX size={48} />}
        />
      </div>
    );
  }

  if (loading)
    return (
      <div className="p-8">
        <Spinner />
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl p-8">
      <PageHeader
        title="Users"
        subtitle="Approve signup requests and manage dashboard access."
      />

      {error && (
        <div className="mb-6 rounded-xl border border-red/20 bg-red/10 px-4 py-3 text-sm text-red">
          {error}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Pending Signups</h2>
            <p className="mt-1 text-xs text-dim">
              New employer accounts waiting for approval.
            </p>
          </div>
          <div className="divide-y divide-border/50">
            {pending.length === 0 && (
              <p className="p-5 text-sm text-dim">No pending requests.</p>
            )}
            {pending.map((request) => (
              <div key={request.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{request.name}</p>
                    <p className="text-xs text-dim">{request.email}</p>
                  </div>
                  <Badge color="amber">pending</Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Btn
                    size="sm"
                    variant="esi"
                    onClick={() => approve(request.id)}
                  >
                    <Check size={14} />
                    Accept
                  </Btn>
                  <Btn
                    size="sm"
                    variant="ghost"
                    onClick={() => reject(request.id)}
                  >
                    Reject
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">User Directory</h2>
            <p className="mt-1 text-xs text-dim">
              Admins can edit everything. Employers cannot access this users
              page.
            </p>
          </div>
          {users.length === 0 ? (
            <Empty message="No users found." icon={<UserCheck size={42} />} />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id}>
                    <Td>{item.name}</Td>
                    <Td>{item.email}</Td>
                    <Td>
                      <Badge color={item.role === "admin" ? "esi" : "blue"}>
                        {item.role}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        color={
                          item.status === "approved"
                            ? "green"
                            : item.status === "pending"
                              ? "amber"
                              : "red"
                        }
                      >
                        {item.status}
                      </Badge>
                    </Td>
                    <Td className="text-right">
                      {item.id !== user?.id && (
                        <div className="flex justify-end gap-2">
                          <Btn
                            size="sm"
                            variant="default"
                            onClick={() => startEdit(item)}
                          >
                            Edit
                          </Btn>
                          <Btn
                            size="sm"
                            variant="ghost"
                            onClick={() => remove(item.id)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </Btn>
                        </div>
                      )}
                      {item.id === user?.id && (
                        <Btn
                          size="sm"
                          variant="default"
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </Btn>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold">Edit User</h2>
              <p className="text-xs text-dim">Editing {editingUser.name}</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dim">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full rounded border border-border bg-bg px-3 py-2 text-sm"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dim">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded border border-border bg-bg px-3 py-2 text-sm"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dim">
                  Role
                </label>
                <select
                  className="w-full rounded border border-border bg-bg px-3 py-2 text-sm"
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dim">
                  Status
                </label>
                <select
                  className="w-full rounded border border-border bg-bg px-3 py-2 text-sm"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dim">
                  New Password{" "}
                  <span className="text-xs text-dim">
                    (leave empty to keep current)
                  </span>
                </label>
                <input
                  type="password"
                  className="w-full rounded border border-border bg-bg px-3 py-2 text-sm"
                  placeholder="Enter new password (optional)"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Btn variant="ghost" onClick={cancelEdit}>
                  Cancel
                </Btn>
                <Btn variant="esi" onClick={saveEdit}>
                  Save Changes
                </Btn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
