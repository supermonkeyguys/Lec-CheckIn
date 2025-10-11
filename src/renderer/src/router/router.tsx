import { createHashRouter } from "react-router-dom";
import ClockIn from "../pages/ClockIn/ClockIn";
import ManageLayout from "../layouts/ManageLayout";
import ClockRecord from "../pages/ClockIn/ClockRecord/ClockRecord";
import ClockRanking from "../pages/ClockIn/ClockRanking/ClockRanking";
import DrawCard from "../pages/DrawCard/DrawCard";
import Profile from "../pages/Profile/Profile";
import TeamMember from "../pages/TeamMember/TeamMember";
import NotFound from "../pages/NotFound";
import type { Router } from '@remix-run/router'
import Home from "@renderer/pages/Home/Home";
import HomeLayout from "@renderer/layouts/HomeLayout";



const routerConfigure:Router = createHashRouter([
    {
        path:'/',
        element: <HomeLayout />,
        children: [
            {
                index:true,
                element:<Home />
            }
        ]
    },
    {
        path: '/clock',
        element: (
            <ManageLayout />
        ),
        children: [
            {
                path: 'clockIn',
                element: <ClockIn />,
            },
            {
                path: 'drawCard',
                element: <DrawCard />
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: 'teamMember',
                element: <TeamMember />
            },
            {
                path: 'record',
                element: <ClockRecord />
            },
            {
                path: 'points',
                element: <ClockRanking />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
])


export default routerConfigure

const clock_pathname = '/clock'
export const CLOCKIN_PAGE_PATHNAME = clock_pathname + '/clockIn'
export const DRAWCARD_PAGE_PATHNAME = clock_pathname + '/drawCard'
export const PROFILE_PAGE_PATHNAME = clock_pathname + '/profile'
export const TEAMMEMBER_PAGE_PATHNAME = clock_pathname + '/teamMember'
export const RECORD_PAGE_PATHNAME = clock_pathname + '/record'
export const POINTS_PAGE_PATHNAME = clock_pathname + '/points'

export const ROUTES = {
    CLOCKIN: CLOCKIN_PAGE_PATHNAME,
    DRAWCARD: DRAWCARD_PAGE_PATHNAME,
    PROFILE: PROFILE_PAGE_PATHNAME,
    TEAMMEMBER: TEAMMEMBER_PAGE_PATHNAME
}