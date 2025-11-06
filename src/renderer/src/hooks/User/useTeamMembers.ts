import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useGetMembersInfo } from './useGetMembersInfo';
import { connectRankingSocket } from '@renderer/pages/ClockIn/ClockRanking/utils/socket';

export type UserItem = {
  nickname: string;
  avatarUrl: string;
  grade: string;
  pointsBalance: number;
  todayDuration: number;
};

const gradeList = ['all', 'freshman', 'sophomore', 'junior', 'senior'] as const;
export type Grade = typeof gradeList[number];

export function useTeamMembers(initialGrade: Grade = 'all') {
  const [currentGrade, setCurrentGrade] = useState<Grade>(initialGrade);
  const { data, run, loading } = useGetMembersInfo();

  const setGrade = (grade: Grade) => setCurrentGrade(grade);

  const allMembers = data || ([] as UserItem[]);
  const filteredMembers = currentGrade === 'all'
    ? allMembers
    : allMembers.filter(m => m.grade === currentGrade);

  useEffect(() => {
    run(currentGrade === 'all' ? 'all' : currentGrade);
  }, [currentGrade]);

  useEffect(() => {
    const disconnect = connectRankingSocket(
      () => run(currentGrade === 'all' ? 'all' : currentGrade),
      (error) => message.error("实时连接错误：" + error.message)
    );
    return () => disconnect();
  }, [currentGrade]);

  return {
    currentGrade,
    setGrade,
    allMembers,
    filteredMembers,
    loading,
    gradeList,
    run,
  };
}