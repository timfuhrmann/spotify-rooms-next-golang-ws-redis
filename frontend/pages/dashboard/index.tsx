import React from "react";
import { GetServerSideProps } from "next";
import styled from "styled-components";
import { Template } from "../../app/template/Template";
import { getSpotifyAccessToken } from "../../app/lib/api/backend";
import { setCookie } from "nookies";
import { getCookieDate } from "../../app/lib/util/api/getCookieDate";
import { APP_COOKIES, getAccessTokenFromCookies } from "../../app/lib/util/api/checkCookies";

import { SecondaryHeadline } from "../../app/css/typography/headlines";
import { Content } from "../../app/css/content";
import { DashboardItem } from "../../app/components/dashboard/DashboardItem";
import { useWebsocket } from "../../app/context/websocket/WebsocketContext";

const DashboardWrapper = styled.div`
    padding-top: 12.5rem;
`;

const DashboardList = styled.div`
    margin-top: 1rem;
`;

const DashboardItemWrapper = styled.div`
    margin-top: 1rem;
`;

const Dashboard: React.FC = () => {
    const { rooms } = useWebsocket();

    return (
        <Template>
            <DashboardWrapper>
                <Content>
                    <SecondaryHeadline>Rooms</SecondaryHeadline>
                    {rooms && (
                        <DashboardList>
                            {Object.keys(rooms).map(rid => (
                                <DashboardItemWrapper key={rid}>
                                    <DashboardItem {...rooms[rid]} />
                                </DashboardItemWrapper>
                            ))}
                        </DashboardList>
                    )}
                </Content>
            </DashboardWrapper>
        </Template>
    );
};

export const getServerSideProps: GetServerSideProps = async context => {
    const { code } = context.query;

    if (code) {
        const res = await getSpotifyAccessToken(code as string);

        if (res.access_token) {
            setCookie(context, APP_COOKIES, JSON.stringify({ ...res, date: new Date() }), {
                httpOnly: true,
                path: "/",
                expires: getCookieDate(),
            });

            return {
                redirect: {
                    destination: "/dashboard",
                    permanent: false,
                },
            };
        }
    } else {
        const access_token = getAccessTokenFromCookies(context.req.cookies);

        if (access_token) {
            return {
                props: {
                    authToken: access_token,
                },
            };
        } else {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        }
    }

    return {
        redirect: {
            destination: "/",
            permanent: false,
        },
    };
};

export default Dashboard;
