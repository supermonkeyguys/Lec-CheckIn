import { submitCheckInService } from "@renderer/services/clock";
import { useRequest } from "ahooks";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { addCheckInRecord } from "../../store/clockReducer";
import { CheckInRecord, SubmitCheckInParams } from "../../store/clockReducer/type";

export function useSubmitCheckIn() {
    const dispatch = useDispatch()

    const { run: submitCheckIn, loading } = useRequest(
        async (params: SubmitCheckInParams) => {
            console.log("params: ", params)
            const res = await submitCheckInService(params);
            return res;
        },
        {
            manual: true,
            onSuccess(res) {
                console.log(1)
                const newRecord = res as CheckInRecord;
                dispatch(addCheckInRecord(newRecord));
                message.success('打卡成功');
            },
            onError(err) {
                console.error(err)
                message.error('打卡失败')
                throw new  Error('打卡失败')
            }
        }
    )

    return { loading, submitCheckIn }
}