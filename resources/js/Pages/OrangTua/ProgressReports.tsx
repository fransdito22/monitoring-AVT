import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

interface Report {
    id: number;
    patient: string;
    therapist: string;
    session_date: string;
    progress: number;
    summary: string | null;
}

interface Props {
    reports: Report[];
}

export default function ProgressReports({ reports }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Progress Terapi" />

            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Progress Terapi Anak</h1>

                    <p className="text-muted-foreground">
                        Monitoring perkembangan terapi AVT
                    </p>
                </div>

                {reports.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center">
                            Belum ada laporan terapi.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {reports.map((report) => (
                            <Card key={report.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>
                                                {report.patient}
                                            </CardTitle>

                                            <p className="text-sm text-muted-foreground">
                                                Terapis : {report.therapist}
                                            </p>
                                        </div>

                                        <Badge>{report.progress ?? 0}%</Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="text-sm">
                                        <p>
                                            <strong>Tanggal :</strong>{" "}
                                            {report.session_date}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-medium">Ringkasan</p>

                                        <p className="text-sm text-muted-foreground">
                                            {report.summary ??
                                                "Tidak ada catatan"}
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <Link
                                            href={`/orangtua/progress-reports/${report.id}`}
                                        >
                                            <Button>Lihat Detail</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
