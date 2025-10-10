import { FC, useState } from "react";
import ContentComponent from "../../../components/ContentComponent/Component";
import PageInfo from "../../../components/PageInfo";
import RecordFilter from "./RecordFilter/RecordFilter";
import RecordTable from "./RecordTable/RecordTable";
import { DateRange } from "../../../store/clockReducer/type";
import RecordStat from "./RecordStat/RecordStat";
import dayjs from "dayjs";

const ClockRanking: FC = () => {
    const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null })
     
    const handleSearch = (value: any) => {
        if (value.dateRange && value.dateRange.length === 2) {
            const [start, end] = value.dateRange
            const endTime = dayjs(end)
            const startTime = dayjs(start)
            const startOneDay = startTime.add(1,'day')
            const endTimePlusOneDay = endTime.add(2,'day')
            const formattedStartDate = formatDate(startOneDay.toDate())
            const formattedEndDate = formatDate(endTimePlusOneDay.toDate())
            setDateRange({
                startDate: formattedStartDate,
                endDate: formattedEndDate
            })
        }
        else setDateRange({ startDate: null, endDate: null })
    }

    return (
        <ContentComponent
            componentList={[
                () => <PageInfo title="打卡记录" desc="记录你的打卡历史" />,
                () => <RecordFilter onSearch={handleSearch} />,
                () => <RecordTable dateRange={dateRange} />,
                () => <RecordStat />
            ]}
        />
    )
}

export default ClockRanking 


function formatDate(date:Date)  {
    return date.toISOString().split('T')[0]
} 