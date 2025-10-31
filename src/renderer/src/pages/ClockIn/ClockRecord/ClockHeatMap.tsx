import { FC, useMemo } from 'react';
import { Card, Spin, Alert } from 'antd';
import { useRequest } from 'ahooks';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import dayjs from 'dayjs';
import Title from 'antd/es/typography/Title';
import { fetchWeeklyClockData } from '@renderer/services/clock';


interface DailyTotal {
    date: string;
    totalSeconds: number;
    totalHours: number;
    dayLabel: string;
}

const ClockHeatmap: FC = () => {
    const { data, loading, error } = useRequest(
        async () => await fetchWeeklyClockData(),
    );
    const processedData: DailyTotal[] = useMemo(() => {
        if (!data?.dailyTotals) return [];
        return data.dailyTotals.map((item: any) => {
            const date = dayjs(item.date + 'T00:00:00');
            return {
                ...item,
                totalHours: Number((item.totalSeconds / 3600000).toFixed(2)),
                dayLabel: date.format('ddd'),
            };
        });
    }, [data]);

    if (loading) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" tip="加载数据中..." />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <Alert
                    message="数据加载失败"
                    description="请刷新页面重试或联系管理员"
                    type="error"
                    showIcon
                />
            </Card>
        );
    }

    return (
        <Card>
            <Title level={4} style={{ margin: '0 0 16px 0' }}>每日打卡时长趋势</Title>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={processedData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="dayLabel"
                            name="星期"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(label: any) => `周${toNumber(label)}`}
                        />
                        <YAxis
                            name="时长（小时）"
                            domain={[0, 'dataMax + 1']}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value: any) => `${value.toFixed(1)}h`}
                        />
                        <Tooltip
                            formatter={(value: any) => [`${value}小时`, '打卡时长']}
                            labelFormatter={(label: any) => `星期${toNumber(label)}`}
                            contentStyle={{ borderRadius: 4, border: '1px solid #e8e8e8' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="totalHours"
                            name="每日时长"
                            stroke="#1890ff"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default ClockHeatmap;


function toNumber(value: string): string {
    switch (value) {
        case 'Sun':
            return '日';
        case 'Mon':
            return '一';
        case 'Tue':
            return '二';
        case 'Wed':
            return '三';
        case 'Thu':
            return '四';
        case 'Fri':
            return '五';
        case 'Sat':
            return '六';
        default:
            return '';
    }
}