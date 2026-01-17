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
import { Users, Shield, UserCheck } from "lucide-react";

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
    customers: users.filter((u) => u.role === "CUSTOMER").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Users</h1>
        <p className="text-gray-400">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-3">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <p className="text-sm text-gray-400">Total Users</p>
              </div>
              <Users className="h-8 w-8 text-gold/60" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-400">{stats.admins}</div>
                <p className="text-sm text-gray-400">Admins</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500/60" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">{stats.customers}</div>
                <p className="text-sm text-gray-400">Customers</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-500/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">All Users</CardTitle>
          <CardDescription className="text-gray-400">
            View and manage user accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Phone</TableHead>
                  <TableHead className="text-gray-400">Orders</TableHead>
                  <TableHead className="text-gray-400">Reviews</TableHead>
                  <TableHead className="text-gray-400">Role</TableHead>
                  <TableHead className="text-gray-400">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow className="border-gray-800">
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-gray-400">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-gray-700">
                            <AvatarImage src={user.image || ""} />
                            <AvatarFallback className="bg-gold/20 text-gold">
                              {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-white">
                            {user.name || "No name"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{user.email || "No email"}</TableCell>
                      <TableCell className="text-gray-300">{user.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{user._count.orders}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">{user._count.reviews}</Badge>
                      </TableCell>
                      <TableCell>
                        <UserRoleSelect userId={user.id} currentRole={user.role} />
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {format(user.createdAt, "PP")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {users.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No users found</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback className="bg-gold/20 text-gold">
                        {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{user.name || "No name"}</p>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                        {user._count.orders} orders
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                        {user._count.reviews} reviews
                      </Badge>
                    </div>
                    <UserRoleSelect userId={user.id} currentRole={user.role} />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
