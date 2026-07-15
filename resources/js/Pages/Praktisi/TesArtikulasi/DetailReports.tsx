import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    User,
    FileText,
    Calendar,
    CheckCircle,
    AlertTriangle,
    XCircle,
    PlusCircle,
    TrendingUp,
    ArrowLeft,
    Activity,
} from "lucide-react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

interface Detail {
    id: number;
    target_word: string;
    target_phoneme: string;
    category: string;
    note: string | null;
}

interface Report {
    id: number;
    session_date: string;
    summary: string | null;
    details: Detail[];
}

interface Patient {
    id: number;
    name: string;
    photo: string | null;
    status: string;
    progress: number;
    reports: Report[];
}

interface ChartData {
    session: string;
    progress: number;
    date: string;
}

interface Props {
    patient: Patient;

    totals: {
        Normal: number;
        Omisi: number;
        Distorsi: number;
        Adisi: number;
        Substitusi: number;
    };

    chartData: ChartData[];
}

export default function DetailReports({
    patient,
    totals,
    chartData,
}: Props) {
    const getBadge = (category: string) => {
        switch (category) {
            case "Normal":
                return (
                    <Badge className="bg-green-100 text-green-700">
                        Normal
                    </Badge>
                );

            case "Omisi":
                return (
                    <Badge variant="destructive">
                        Omisi
                    </Badge>
                );

            case "Distorsi":
                return (
                    <Badge className="bg-orange-100 text-orange-700">
                        Distorsi
                    </Badge>
                );

            case "Adisi":
                return (
                    <Badge className="bg-purple-100 text-purple-700">
                        Adisi
                    </Badge>
                );

            case "Substitusi":
                return (
                    <Badge className="bg-yellow-100 text-yellow-700">
                        Substitusi
                    </Badge>
                );

            default:
                return <Badge>{category}</Badge>;
        }
    };

    return (
        <AuthenticatedLayout
        header={
            <div>
                <h2 className="text-xl font-semibold">
                    Detail Tes Artikulasi 
                </h2>

                <p className="text-sm text-muted-foreground">
                    Monitoring perkembangan terapi pasien
                </p>
            </div>
        }
        >
            <Head title={`Laporan ${patient.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    
                    <Link href={route("reports.index")}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                {/* Profil Pasien */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-10 w-10 text-primary" />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-2xl font-bold">
                                    {patient.name}
                                </h2>

                                <p className="text-muted-foreground">
                                    Status: {patient.status}
                                </p>

                                <div className="mt-4">
                                    <div className="mb-2 flex justify-between">
                                        <span className="text-sm">
                                            Progress Terapi
                                        </span>

                                        <span className="font-semibold">
                                            {patient.progress}%
                                        </span>
                                    </div>

                                    <Progress
                                        value={patient.progress}
                                    />
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    Total Laporan
                                </p>

                                <h3 className="text-4xl font-bold">
                                    {patient.reports.length}
                                </h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistik */}
                <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                                <span className="text-3xl font-bold">
                                    {totals.Normal}
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-medium">
                                Normal
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <XCircle className="h-6 w-6 text-red-600" />
                                <span className="text-3xl font-bold">
                                    {totals.Omisi}
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-medium">
                                Omisi
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <AlertTriangle className="h-6 w-6 text-orange-600" />
                                <span className="text-3xl font-bold">
                                    {totals.Distorsi}
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-medium">
                                Distorsi
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <PlusCircle className="h-6 w-6 text-purple-600" />
                                <span className="text-3xl font-bold">
                                    {totals.Adisi}
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-medium">
                                Adisi
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <TrendingUp className="h-6 w-6 text-yellow-600" />
                                <span className="text-3xl font-bold">
                                    {totals.Substitusi}
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-medium">
                                Substitusi
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Grafik */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Grafik Perkembangan Terapi
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="h-87.5">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis dataKey="session" />

                                    <YAxis
                                        domain={[0, 100]}
                                    />

                                    <Tooltip />

                                    <Line
                                        type="monotone"
                                        dataKey="progress"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Riwayat */}
                {patient.reports.map((report) => (
                    <Card key={report.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Laporan #{report.id}
                            </CardTitle>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />

                                {new Date(
                                    report.session_date
                                ).toLocaleDateString("id-ID")}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {report.summary && (
                                <div className="rounded-lg bg-muted p-4">
                                    <h4 className="mb-2 font-semibold">
                                        Kesimpulan Terapis
                                    </h4>

                                    <p>{report.summary}</p>
                                </div>
                            )}

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            Kata Target
                                        </TableHead>

                                        <TableHead>
                                            Fonem
                                        </TableHead>

                                        <TableHead>
                                            Kategori
                                        </TableHead>

                                        <TableHead>
                                            Catatan
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {report.details.map(
                                        (detail) => (
                                            <TableRow
                                                key={detail.id}
                                            >
                                                <TableCell>
                                                    {
                                                        detail.target_word
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        detail.target_phoneme
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    {getBadge(
                                                        detail.category
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {detail.note ??
                                                        "-"}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}

                {patient.reports.length === 0 && (
                    <Card>
                        <CardContent className="py-10 text-center">
                            <FileText className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

                            <h3 className="font-semibold">
                                Belum Ada Laporan
                            </h3>

                            <p className="text-muted-foreground">
                                Pasien belum memiliki data terapi.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}