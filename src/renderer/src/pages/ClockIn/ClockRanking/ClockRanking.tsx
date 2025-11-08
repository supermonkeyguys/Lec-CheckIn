import { FC, useEffect, useState } from "react";
import ContentComponent from "../../../components/ContentComponent/Component";
import PageInfo from "../../../components/PageInfo";
import { Button, Card, Cascader, Form, Segmented, Table } from "antd";
import Title from "antd/es/typography/Title";
import { ClockCircleOutlined, TrophyOutlined } from "@ant-design/icons";
import { connectRankingSocket } from "./utils/socket";
import { formatDuration } from "../ClockRecord/utils/utils";
import { getUserRankingService } from "@renderer/services/clock";
import styles from './ClockRanking.module.scss'
import { getGrade } from "@renderer/utils/getGrade";


interface OptionType {
    value: string;
    label: string;
}

const options1: OptionType[] = [
    {
        value: 'allGrade',
        label: '全部年级'
    },
    {
        value: 'freshman',
        label: '大一'
    },
    {
        value: 'sophomore',
        label: '大二'
    },
    {
        value: 'junior',
        label: '大三'
    },
    {
        value: 'senior',
        label: '大四'
    },
]

const options2: OptionType[] = [
    {
        value: 'all',
        label: '总榜',
    },
    {
        value: 'month',
        label: '月榜',
    },
    {
        value: 'week',
        label: '周榜',
    },

]

const RankFilter: FC<{
    onFilter: (data: any) => void;
    activeKey: string;
    form: any;
}> = ({ onFilter, activeKey, form }) => {

    const handleSubmit = async () => {
        const values = await form.validateFields()

        const timeRangeMap: Record<string, string> = { all: 'total', month: 'month', week: 'week' };
        const gradeMap: Record<string, string | undefined> =
            { allGrade: undefined, freshman: 'freshman', sophomore: 'sophomore', junior: 'junior', senior: 'senior' };
        const sortByMap: Record<string, string> = { checkIn: 'checkIn', points: 'points' };

        const params = {
            timeRange: timeRangeMap[values.timeCas] as string,
            grade: gradeMap[values.gradeCas] as string | undefined,
            sortBy: sortByMap[activeKey] as string,
        };

        console.log(params)
        const res = await getUserRankingService(params);
        onFilter(res);
    }


    return (
        <Card>
            <Form
                className={styles.rankFilter}
                form={form}
                initialValues={{ gradeCas: 'allGrade', timeCas: 'all' }}
                onFinish={handleSubmit}
            >
                <Form.Item
                    name='gradeCas'
                    label='选择年级'
                >
                    <Cascader
                        options={options1}
                    />
                </Form.Item>
                <Form.Item
                    name='timeCas'
                    label='选择时间'
                >
                    <Cascader
                        options={options2}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type='primary'
                        htmlType="submit"
                    >
                        应用筛选
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}


const RankCard: FC<{
    activeKey: string;
    dataSource: any[];
}> = ({ activeKey, dataSource }) => {
    const columns = [
        {
            title: '排行',
            dataIndex: 'rank',
            key: 'rank',
            render: (rank: number) => {
                let rankClass = styles.normal;
                if (rank === 1) rankClass = styles.first;
                else if (rank === 2) rankClass = styles.second;
                else if (rank === 3) rankClass = styles.third;

                return <span className={rankClass}>{rank}</span>;
            }
        },
        {
            title: '成员',
            dataIndex: 'nickname',
            key: 'nickname'
        },
        {
            title: '年级',
            dataIndex: 'grade',
            key: 'grade',
            render: (grade: string) => (
                <span>
                    {getGrade(grade)}
                </span>
            )
        },
        {
            title: activeKey === 'checkIn' ? '打卡时长' : '积分',
            dataIndex: activeKey === 'checkIn' ? 'totalDuration' : 'pointsBalance',
            key: activeKey === 'checkIn' ? 'totalDuration' : 'pointsBalance',
            render: (value: number) => (
                <span className={styles[activeKey]}>
                    {activeKey === 'checkIn' ? `${formatDuration(value)}` : `${value}分`}
                </span>
            )
        }
    ]


    return (
        <Card>
            <Title level={4} style={{ margin: 0, marginBottom: '30px' }}>
                {activeKey === 'checkIn' ? '打卡时长' : '积分'}排行榜
            </Title>
            <Table
                rowKey='username'
                dataSource={dataSource ?? []}
                showHeader={true}
                columns={columns}
            />
        </Card>
    )
}

const ClockRanking: FC = () => {
    const [form] = Form.useForm()
    const [activeKey, setActiveKey] = useState('checkIn')
    const [rankingData, setRankingData] = useState<any[]>([])

    const handleFilter = (data: any) => {
        setRankingData(data)
    }

    useEffect(() => {
        if (form) form.submit()
    }, [activeKey, form])

    useEffect(() => {
        const cleanup = connectRankingSocket(
            (data) => {
                setRankingData(data.data)
            },
            (err) => {
                console.log('WebSocket 错误', err)
            }
        )

        return () => {
            cleanup()
        }
    }, [])

    return (
        <ContentComponent>
            <PageInfo title="打卡排行榜" desc="查看个人排名" />
            <div className={styles.segmented}>
                <Segmented
                    shape="round"
                    options={[
                        { label: '打卡时长', value: 'checkIn', icon: <ClockCircleOutlined /> },
                        { label: '积分排行', value: 'points', icon: <TrophyOutlined /> },
                    ]}
                    value={activeKey}
                    onChange={(value) => setActiveKey(value)}
                />
            </div>
            <RankFilter onFilter={handleFilter} activeKey={activeKey} form={form} />
            <RankCard activeKey={activeKey} dataSource={rankingData} />
        </ContentComponent>

    )
}

export default ClockRanking  