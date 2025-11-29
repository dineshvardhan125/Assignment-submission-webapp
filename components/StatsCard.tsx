import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        positive: boolean;
        label: string;
    };
    description?: ReactNode;
}

export function StatsCard({ title, value, icon: Icon, trend, description }: StatsCardProps) {
    return (
        <div className="glass-card p-6 hover-glow transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
                        <span className="font-medium">{trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-2xl font-bold mb-1">{value}</h3>
                <p className="text-sm text-muted-foreground">{title}</p>
                {description && <div className="mt-2 text-xs">{description}</div>}
            </div>
        </div>
    );
}
