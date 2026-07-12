import type { RecentChild } from "@/types/dashboard";
import EmptyState from "./EmptyState";

interface RecentChildrenTableProps {
    children: RecentChild[];
}

export default function RecentChildrenTable({
    children,
}: RecentChildrenTableProps) {
    if (children.length === 0) {
        return (
            <EmptyState
                title="Belum ada data anak"
                description="Data anak yang baru didaftarkan akan muncul di sini."
            />
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Nama Anak
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Orang Tua
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Praktisi
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Tanggal
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                    {children.map((child) => (
                        <tr
                            key={child.id}
                            className="hover:bg-gray-50"
                        >
                            <td className="px-4 py-3 font-medium text-gray-900">
                                {child.name}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                                {child.parent_name}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                                {child.therapist_name}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                                {new Date(child.created_at).toLocaleDateString(
                                    "id-ID"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}