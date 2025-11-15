import { startCheckInState } from '@renderer/services/clock';
import { useRequest } from 'ahooks';
import { message } from 'antd';

export function useStartCheckIn(): {
  start: () => void;
  loadingStart: boolean;
} {
  const { run: start, loading: loadingStart } = useRequest(
    async () => {
      const res = await startCheckInState(new Date().toISOString());
      return res;
    },
    {
      manual: true,
      onSuccess: (res): void => {
        if (res?.ok) message.success(res?.message);
        else message.error(res?.message);
      },
      onError: (err): void => {
        console.error(err);
        const errorMsg = err instanceof Error ? err.message : String(err);
        message.error(errorMsg);
      },
    }
  );

  return { start, loadingStart };
}
