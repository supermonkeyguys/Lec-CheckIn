import { updateUserSetting } from '@renderer/services/user'
import { SettingState, updateSetting } from '@renderer/store/settingReducer'
import { useRequest } from 'ahooks'
import { message } from 'antd'
import { useDispatch } from 'react-redux'
import { useSetting } from '../useSetting'

type UpdateRemindPropsType = {
  setPendingRemindTime?: (rt: any) => void
  setRemindInterval?: (ri: any) => void
}

export function useUpdateUserSetting({
  setPendingRemindTime,
  setRemindInterval
}: UpdateRemindPropsType) {
  const dispatch = useDispatch()
  const { reminderTime, reminderInterval } = useSetting()
  const { loading, run } = useRequest(
    async (settings: SettingState) => {
      console.log(settings)
      try {
        await window.electronAPI?.updateUserSetting(settings)
      } catch (err) {
        if (setPendingRemindTime) setPendingRemindTime(reminderTime)
        if (setRemindInterval) setRemindInterval(reminderInterval)
        throw new Error(err?.toString())
      }

      dispatch(updateSetting(settings))

      try {
        const res = await updateUserSetting(settings)
        return res as any
      } catch (err) {
        return { __serverFailed: true } as any
      }
    },
    {
      manual: true,
      onSuccess(res) {
        if (res?.__serverFailed) {
            message.warning("已保存到本地,云端同步失败");
            return;
          }
          if (res?.updatedSetting) {
            message.success("设置已保存并同步");
          } else {
            message.success("设置已保存（本地）");
          }
      },
      onError(err) {
        if (setPendingRemindTime) setPendingRemindTime(reminderTime)
        if (setRemindInterval) setRemindInterval(reminderInterval)
        console.log(err)
        message.error('开大差了')
      }
    }
  )

  return {
    loading,
    run
  }
}
