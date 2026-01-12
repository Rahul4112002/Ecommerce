import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { UserRoleSelect } from "./role-select";

async function getUsers() {
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      phone: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
        },
      },
    },
  });
}

export default async function UsersPage() {
  const users = await getUsers();

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    customers: users.filter((u) => u.role === "USER").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.customers}</div>
            <p className="text-sm text-muted-foreground">Customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage user accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">No users found</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image || ""} />
                          <AvatarFallback>
                            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {user.name || "No name"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user._count.orders}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user._count.reviews}</Badge>
                    </TableCell>
                    <TableCell>
                      <UserRoleSelect userId={user.id} currentRole={user.role} />
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {format(user.createdAt, "PP")}
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
