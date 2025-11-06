import React, { FC, useEffect, useState } from 'react';
import { Table, Button, Typography, Flex, Tag, Card } from 'antd';
import type { TableProps } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { DateRange } from '../../../../store/clockReducer/type';
import { formatDuration } from '../utils/utils';
import { useCheckInRecord } from '../../../../hooks/CheckIn/useCheckInRecord';
import { useGetAllCheckInRecord } from '../../../../hooks/CheckIn/useGetAllCheckInRecord';
import dayjs from 'dayjs';

const { Title } = Typography;

interface RecordItem {
  key: React.Key;
  checkInDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  points?: number;
}

export type RecordData = {
  total: number;
  list: any[]
}


const RecordTable: FC<{
  dateRange: DateRange;
}> = ({ dateRange }) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [finalData, setFinalData] = useState<RecordData>({ total: 0, list: [] })
  const [sortParams, setSortParams] = useState<{ sortBy: string; sortOrder: 'asc' | 'desc' }>({
    sortBy: 'checkInDate',
    sortOrder: 'desc'
  })
  const { getRecords, loading, records } = useCheckInRecord()
  const { getAllRecords, allRecords, allRecordsLoading } = useGetAllCheckInRecord()
  const isLoading = loading || allRecordsLoading

  const fetchRecordData = async () => {
    const { startDate, endDate } = dateRange
    if (startDate && endDate) {
      await getRecords({
        startDate,
        endDate,
        page,
        pageSize,
        ...sortParams,
      })
    }
    else if (!startDate && !endDate) {
      await getAllRecords({
        page,
        pageSize,
        ...sortParams
      })
    }
    return;
  }

  useEffect(() => {
    const { startDate, endDate } = dateRange
    if (startDate && endDate) {
      if (records && records.list) {
        setFinalData(records as any)
      }
    } else {
      if (allRecords && allRecords.list) {
        setFinalData(allRecords as any)
      }
    }
  }, [records, allRecords, dateRange, page, pageSize])

  useEffect(() => {
    fetchRecordData()
  }, [page, pageSize,dateRange,sortParams])


  const columns: TableProps<RecordItem>['columns'] = [
    {
      title: '日期',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      sorter: (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime(),
      render: (date) => {
        return (
          <span>
            {dayjs(date).format('YYYY-MM-DD')}
          </span>
        )
      }
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime: string) => {
        return (
          <span>
            {dayjs(startTime).format('HH:mm')}
          </span>
        )
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime: string) => (
        <span>
          {dayjs(endTime).format('HH:mm')}
        </span>
      )
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      sorter: true,
      render: (minutes: number) => `${formatDuration((minutes))}`,
    },
    {
      title: '获得积分',
      dataIndex: 'points',
      key: 'points',
      render: (points: number) => <Tag color="gold">{points}</Tag>
    },
  ];

  return (
    <Card style={{ zIndex: '9' }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>打卡记录列表</Title>
        <Button onClick={fetchRecordData} icon={<RedoOutlined />} type="primary" disabled={isLoading}>
          刷新数据
        </Button>
      </Flex>
      <Table<RecordItem>
        rowKey={(record) => record.key + record.startTime + record.endTime}
        dataSource={finalData?.list?.map((item: any, index: number) => ({
          key: index,
          checkInDate: item.checkInDate,
          startTime: item.startTime,
          endTime: item.endTime,
          duration: item.duration,
          points: item.rewardPoints
        })) ?? []}
        columns={columns}
        loading={isLoading}
        pagination={{
          total: finalData?.total,
          showTotal: (total) => `共 ${total} 条记录`,
          defaultPageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}
        onChange={(pagination, sorter: any) => {
          const { current = 1, pageSize: ps = pageSize } = pagination || {}

          if (sorter && sorter.field) {
            const sortBy = sorter.field
            const sortOrder = sorter.order === 'descend' ? 'desc' : 'asc'
            setSortParams({ sortBy, sortOrder })

            setPage(current)
            setPageSize(ps)
          } else {
            setPage(current)
            setPageSize(ps)
          }
        }}
      />
    </Card>
  );
};

export default RecordTable;