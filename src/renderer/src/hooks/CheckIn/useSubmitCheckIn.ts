import { useRequest } from "ahooks";
import { CheckInRecord, SubmitCheckInParams } from "../../store/clockReducer/type";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { addCheckInRecord } from "../../store/clockReducer";
import { submitCheckInService } from "@renderer/services/clock";

export function useSubmitCheckIn() {
    const dispatch = useDispatch()

    const { run: submitCheckIn, loading, data } = useRequest(
        async (params: SubmitCheckInParams) => {
            const res = submitCheckInService(params);
            return res;
        },
        {
            manual: true,
            onSuccess(res) {
                message.success('打卡成功');
                const newRecord = res as CheckInRecord;
                dispatch(addCheckInRecord(newRecord));
            },
            onError(err) {
                throw new  Error('打卡失败')
            }
        }
    )

    return { loading, submitCheckIn, data }
}