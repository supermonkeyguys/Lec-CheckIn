import { createHashRouter } from "react-router-dom";
import { JSX, Suspense, lazy } from "react";
import type { Router } from "@remix-run/router";

function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  let tried = false;
  return lazy(async () => {
    try {
      return await factory();
    } catch (e) {
      if (!tried) {
        tried = true;
        await new Promise((r) => setTimeout(r, 150));
        return await factory();
      }
      throw e;
    }
  });
}

const withSuspense = (element: JSX.Element) => (
  <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
    {element}
  </Suspense>
);

const HomeLayout = lazyWithRetry(() => import("@renderer/layouts/HomeLayout"));
const ManageLayout = lazyWithRetry(() => import("../layouts/ManageLayout"));

const Home = lazyWithRetry(() => import("@renderer/pages/Home/Home"));
const ClockIn = lazyWithRetry(() => import("../pages/ClockIn/ClockIn"));
const ClockRecord = lazyWithRetry(() => import("../pages/ClockIn/ClockRecord/ClockRecord"));
const ClockRanking = lazyWithRetry(() => import("../pages/ClockIn/ClockRanking/ClockRanking"));
const DrawCard = lazyWithRetry(() => import("../pages/DrawCard/DrawCard"));
const Profile = lazyWithRetry(() => import("../pages/Profile/Profile"));
const TeamMember = lazyWithRetry(() => import("../pages/TeamMember/TeamMember"));
const Setting = lazyWithRetry(() => import("@renderer/pages/SettingPage/Setting"));
const MeetingLobby = lazyWithRetry(() => import("@renderer/WebRTC/pages/MeetingLobby/MeetingLobby"));
const ConferenceRoom = lazyWithRetry(() => import("@renderer/WebRTC/pages/ConferenceRoom/ConferenceRoom"));
const NotFound = lazyWithRetry(() => import("../pages/NotFound"));

const clock_pathname = '/clock';
export const CLOCKIN_PAGE_PATHNAME = clock_pathname + '/clockIn';
export const DRAWCARD_PAGE_PATHNAME = clock_pathname + '/drawCard';
export const PROFILE_PAGE_PATHNAME = clock_pathname + '/profile';
export const TEAMMEMBER_PAGE_PATHNAME = clock_pathname + '/teamMember';
export const RECORD_PAGE_PATHNAME = clock_pathname + '/record';
export const POINTS_PAGE_PATHNAME = clock_pathname + '/points';
export const SETTING_PAGE_PATHNAME = clock_pathname + '/setting';
export const MEETING_LOBBY_PATHNAME = clock_pathname + '/meeting';
export const CONFERENCE_ROOM_PATHNAME = 'conference/:roomId';

const routerConfigure: Router = createHashRouter([
  {
    path: '/home',
    element: withSuspense(<HomeLayout />),
    children: [
      {
        index: true,
        element: withSuspense(<Home />),
      },
    ],
  },
  {
    path: '/clock',
    element: withSuspense(<ManageLayout />),
    children: [
      { path: 'clockIn', element: withSuspense(<ClockIn />) },
      { path: 'drawCard', element: withSuspense(<DrawCard />) },
      { path: 'profile', element: withSuspense(<Profile />) },
      { path: 'teamMember', element: withSuspense(<TeamMember />) },
      { path: 'record', element: withSuspense(<ClockRecord />) },
      { path: 'points', element: withSuspense(<ClockRanking />) },
      { path: 'setting', element: withSuspense(<Setting />) },
      { path: 'meeting', element: withSuspense(<MeetingLobby />) },
      { path: CONFERENCE_ROOM_PATHNAME, element: withSuspense(<ConferenceRoom />) },
    ],
  },
  {
    path: '*',
    element: withSuspense(<NotFound />),
  },
]);

export default routerConfigure;

export const ROUTES = {
  CLOCKIN: CLOCKIN_PAGE_PATHNAME,
  DRAWCARD: DRAWCARD_PAGE_PATHNAME,
  PROFILE: PROFILE_PAGE_PATHNAME,
  TEAMMEMBER: TEAMMEMBER_PAGE_PATHNAME,
  SETTING: SETTING_PAGE_PATHNAME,
  MEETING: MEETING_LOBBY_PATHNAME,
};
